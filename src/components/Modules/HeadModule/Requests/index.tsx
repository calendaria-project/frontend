import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import {
    accessRemoveTypeEnum,
    accessRequestStatuses,
    appItemTypeValues,
    appTypesEnum,
    dictionaryCodesEnum,
    mainMenuEnum
} from "data/enums";
import { accessRequestTranscripts, appTypesEnumTranscripts } from "data/transcripts";
import { useDispatch } from "react-redux";
import { useTheme } from "react-jss";
import {
    Button,
    Col,
    Dropdown,
    Form,
    Input,
    Menu,
    message,
    Row,
    Select,
    Space,
    Typography
} from "antd";

import useStyles from "./styles";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel,
    IAccessApplicationItemModel,
    ISimpleDictionaryViewModel,
    IUsersViewModel
} from "interfaces";
import { DownOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { BOOKING, OUTGOING, selectReqValues } from "./defaultValues";
import {
    ALL_BOOKINGS,
    ALL,
    accessReqStatuses,
    accessShowValues,
    accessShowValuesNamesArr
} from "data/constants";
import cx from "classnames";
import ReqTable from "./ReqTable";
import Spinner from "ui/Spinner";
import { ITheme } from "styles/theme/interface";
import useDelayedInputSearch from "hooks/useDelayedInputSearch";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import filterRequests from "utils/filterAccessRequests";
import getFullName from "utils/getFullName";
import { getFormattedDateFromNow } from "utils/getFormattedDates";
import { IUsersWithInfoModel } from "interfaces/extended";
import { removeEmptyValuesFromAnyLevelObject } from "utils/removeObjectProperties";
import getObjectWithHandledDates from "utils/getObjectWithHandeledDates";

const AccessReqModal = React.lazy(
    () => import("components/Shared/modalRenderer/ReadyModals/AccessReqModal")
);
const RemoveAccessReqModal = React.lazy(
    () => import("components/Shared/modalRenderer/ReadyModals/RemoveAccessReqModal")
);
const { Option } = Select;
const { Text } = Typography;

const Requests: FC = () => {
    const dispatch = useDispatch();

    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.requests));
    }, []);

    const [form] = Form.useForm();

    const [allUsers, setAllUsers] = useState<IUsersWithInfoModel[]>([]);
    const [isAddReqFlag, setIsAddReqFlag] = useState(false);
    const [modalValues, setModalValues] = useState<ISimpleDictionaryViewModel[]>([]);
    const [currentUser, setCurrentUser] = useState<IUsersViewModel>({} as IUsersViewModel);
    const currentUserId = currentUser?.userId;

    const [reqModalVisible, setReqModalVisible] = useState(false);

    const [allRequests, setAllRequests] = useState<IAccessAppDataByCurrentUserViewModel>(
        {} as IAccessAppDataByCurrentUserViewModel
    );
    const [copiedRequests, setCopiedRequests] = useState<IAccessAppDataByCurrentUserViewModel>(
        {} as IAccessAppDataByCurrentUserViewModel
    );
    const [loadingRequests, setLoadingRequests] = useState(false);

    const [selectReqValue, setSelectReqValue] = useState(
        sessionStorage.getItem("selectHeadRequestsValue") || OUTGOING
    );
    const [handlingValue, setHandlingValue] = useState("");

    const isBooking = selectReqValue === BOOKING;

    useEffect(() => {
        !isBooking
            ? setHandlingValue(sessionStorage.getItem("filterHeadRequestsStatuses") || ALL)
            : setHandlingValue(sessionStorage.getItem("sortHeadShowValue") || ALL_BOOKINGS);
    }, [isBooking]);

    const [query, setQuery] = useState("");
    const { searchStr, handleFiltrationChange } = useDelayedInputSearch(query, setQuery);
    const {
        postAccessApplication,
        getOutgoingAccessApplication,
        getIncomingAccessApplication,
        getUsersWithPhotoId,
        getCurrentUserData,
        getUsersByCompanyId,
        getDictionaryValues
    } = useSimpleHttpFunctions();

    useEffect(() => {
        initModalData();
    }, []);

    const initModalData = async () => {
        const data = await getDictionaryValues(`simple/${dictionaryCodesEnum.APP_ITEM_TYPE}`);
        setModalValues(data);
    };

    useEffect(() => {
        initCurrentUserData();
    }, []);

    const initCurrentUserData = async () => {
        const currUserData: IUsersViewModel = await getCurrentUserData();
        setCurrentUser(currUserData);
    };

    useEffect(() => {
        initAllUsersData();
    }, [currentUser]);

    const initAllUsersData = async () => {
        if (isObjectNotEmpty(currentUser)) {
            const company = currentUser.company;
            if (company) {
                const usersData: IUsersViewModel[] = await getUsersByCompanyId(company.companyId);
                const usersDataWithFullName = usersData.map((user) => ({
                    ...user,
                    fullName: getFullName(user.firstname, user.lastname, user.patronymic)
                }));
                setAllUsers(usersDataWithFullName);
            }
        }
    };

    useEffect(() => {
        initReqData();
    }, [isBooking, selectReqValue]);

    const initReqData = async () => {
        if (!isBooking) {
            setLoadingRequests(true);
            let reqData: IAccessAppDataByCurrentUserViewModel;

            if (selectReqValue === OUTGOING) {
                reqData = await getOutgoingAccessApplication();
            } else {
                const currUserData: IUsersViewModel = await getCurrentUserData();
                reqData = await getIncomingAccessApplication(currUserData.company?.companyId);
            }

            const newData: [string, IAccessAppDataByCurrentUserInKeyViewModel[]][] =
                await Promise.all(
                    Object.entries(reqData || {}).map(async ([key, allReqsInKey]) => {
                        const reqs = await Promise.all(
                            allReqsInKey.map(async (req) => {
                                const modifiedReq = await getUsersWithPhotoId([
                                    req.applicationUser
                                ]);
                                return { ...req, applicationUser: modifiedReq[0] };
                            })
                        );
                        return [key, reqs];
                    })
                );

            const formattedData: IAccessAppDataByCurrentUserViewModel = Object.fromEntries(newData);

            setLoadingRequests(false);
            setAllRequests(formattedData ?? {});
            setCopiedRequests(formattedData ?? {});
        }
    };

    useEffect(() => {
        if (!isBooking && isObjectNotEmpty(copiedRequests)) {
            const searchedData: [string, IAccessAppDataByCurrentUserInKeyViewModel[]][] = searchStr
                ? Object.entries(copiedRequests).map(([key, allReqsInKey]) => {
                      return [
                          key,
                          allReqsInKey.filter((req) => {
                              const reqDataStr =
                                  getFullName(
                                      req.applicationUser?.firstname,
                                      req.applicationUser?.lastname,
                                      req.applicationUser?.patronymic
                                  ) +
                                  (appTypesEnumTranscripts[req.appType] || "") +
                                  (getFormattedDateFromNow(req.createdAt) || "") +
                                  (accessRequestTranscripts[req.status] || "");
                              return reqDataStr.toLowerCase().includes(searchStr.toLowerCase());
                          })
                      ];
                  })
                : Object.entries(copiedRequests);
            const searchedAndHandledData = accessShowValuesNamesArr.includes(handlingValue)
                ? searchedData //change for sort util foo
                : filterRequests(handlingValue, searchedData);
            setAllRequests(Object.fromEntries(searchedAndHandledData));
        }
    }, [searchStr, isBooking, copiedRequests, handlingValue]);

    const updateReqData = useCallback(
        (data: IAccessAppDataByCurrentUserViewModel) => {
            setAllRequests(data);
            setCopiedRequests(data);
        },
        [allRequests, copiedRequests, selectReqValue]
    );

    const handleChangeSelectReqValue = useCallback((v: string) => {
        sessionStorage.setItem("selectHeadRequestsValue", v);
        setSelectReqValue(v);
    }, []);

    const handleChangeHandlingValue = useCallback(
        (v: string) => {
            if (!isBooking) {
                sessionStorage.setItem("filterHeadRequestsStatuses", v);
            } else {
                sessionStorage.setItem("sortHeadShowValue", v);
            }
            setHandlingValue(v);
        },
        [isBooking]
    );

    const onFinishReqModal = useCallback(
        async (data: any) => {
            const filteredData = removeEmptyValuesFromAnyLevelObject(data);
            const filteredDataWithDate = getObjectWithHandledDates(filteredData);

            const reqItems: IAccessApplicationItemModel[] = [];
            modalValues.forEach((v) => {
                const needAccess = !!data[v.code];
                if (v.code === appItemTypeValues.MOBILE) {
                    reqItems.push({
                        appItemType: v,
                        needAccess,
                        ...(needAccess ? { tariff: data[`item.${v.code}`] } : {})
                    });
                } else {
                    reqItems.push({
                        appItemType: v,
                        needAccess,
                        ...(needAccess ? { accessType: data[`item.${v.code}`] } : {})
                    });
                }
            });

            let finalReqData: any = {
                appType: filteredDataWithDate.appType,
                comment: filteredDataWithDate.comment || null,
                applicationUserId: filteredDataWithDate.applicationUserId,
                items: reqItems
            };

            if (filteredDataWithDate.appType === appTypesEnum.REMOVE_ACCESS) {
                if (filteredDataWithDate.accessRemoveType.code === accessRemoveTypeEnum.DISMISSAL) {
                    finalReqData = {
                        ...finalReqData,
                        confirmationDocId: filteredDataWithDate.confirmationDocId,
                        accessRemoveType: filteredDataWithDate.accessRemoveType
                    };
                } else {
                    finalReqData = {
                        ...finalReqData,
                        accessRemoveType: filteredDataWithDate.accessRemoveType,
                        accessRemoveReason: filteredDataWithDate.accessRemoveReason,
                        applicationEndDate: filteredDataWithDate.applicationEndDate
                    };
                }
            }

            const accessAppData: IAccessAppDataByCurrentUserInKeyViewModel =
                await postAccessApplication(finalReqData).catch(() =>
                    message.error("Ошибка создания!")
                );

            if (accessAppData && isObjectNotEmpty(accessAppData)) {
                const { applicationUser } = accessAppData;

                const applicationUserWithPhoto = await getUsersWithPhotoId([applicationUser]);

                const finalAccessAppData = {
                    ...accessAppData,
                    applicationUser: applicationUserWithPhoto?.[0]
                };

                message.success("Успешно создано");
                form.resetFields();
                setReqModalVisible(false);

                console.log(finalAccessAppData, currentUserId);

                const currentAccessReqStatus =
                    finalAccessAppData.applicationUser?.userId === currentUserId
                        ? accessRequestStatuses.ON_APPROVEMENT
                        : accessRequestStatuses.ON_PROCESS;
                updateReqData({
                    ...allRequests,
                    [currentAccessReqStatus]: allRequests[currentAccessReqStatus]
                        ? [...allRequests[currentAccessReqStatus], finalAccessAppData]
                        : [finalAccessAppData]
                });
            }
        },
        [modalValues, allRequests, updateReqData, currentUserId]
    );

    const handleOpenReqModal = (addReqFlag: boolean) => () => {
        setIsAddReqFlag(addReqFlag);
        setReqModalVisible(true);
    };

    const dropdownItems = useMemo(
        () => (
            <Menu
                items={[
                    {
                        key: "1",
                        label: (
                            <span onClick={handleOpenReqModal(true)}>
                                Заявка на предоставление доступа
                            </span>
                        )
                    },
                    {
                        key: "2",
                        label: (
                            <span onClick={handleOpenReqModal(false)}>
                                Заявка на удаление доступа
                            </span>
                        )
                    }
                ]}
            />
        ),
        []
    );

    const modalProps = {
        form: form,
        isVisible: reqModalVisible,
        setIsVisible: setReqModalVisible,
        onFinish: onFinishReqModal,
        usersData: allUsers,
        modalValues: modalValues
    };

    return (
        <Row className={classes.wrapper}>
            <Row align={"middle"} justify={"space-between"} className={classes.selectionRow}>
                <Col>
                    <Select
                        className={classes.select}
                        value={selectReqValue}
                        onChange={handleChangeSelectReqValue}
                    >
                        {(selectReqValues || []).map(({ value, label }) => (
                            <Option key={value + label} value={value}>
                                {label}
                            </Option>
                        ))}
                    </Select>
                    <Text className={classes.textForSelection}>Показать:</Text>
                    <Select
                        className={cx(classes.select, classes.handlingSelect)}
                        value={handlingValue}
                        onChange={handleChangeHandlingValue}
                    >
                        {(!isBooking ? accessReqStatuses : accessShowValues).map(
                            ({ value, label }) => (
                                <Option value={value} key={value + label}>
                                    {label}
                                </Option>
                            )
                        )}
                    </Select>
                </Col>
                <Col>
                    <Input
                        className={classes.input}
                        placeholder="Поиск"
                        onChange={handleFiltrationChange}
                        suffix={<SearchOutlined className={classes.suffix} />}
                    />
                    {!isBooking ? (
                        selectReqValue === OUTGOING && (
                            <Dropdown overlay={dropdownItems}>
                                <Button className={classes.btn}>
                                    <Space>
                                        Создать
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        )
                    ) : (
                        <Button className={classes.btn} icon={<PlusOutlined />}>
                            Добавить
                        </Button>
                    )}
                </Col>
            </Row>
            {!isBooking ? (
                loadingRequests ? (
                    <div className={classes.loadIconWrap}>
                        <Spinner style={{ color: theme.color.regular + "" }} />
                    </div>
                ) : (
                    <ReqTable
                        currentUserId={currentUserId}
                        reqData={allRequests}
                        updateReqData={updateReqData}
                    />
                )
            ) : (
                <></>
            )}
            <Suspense>
                {isAddReqFlag ? (
                    <AccessReqModal {...modalProps} title={"Добавить заявку"} okText={"Добавить"} />
                ) : (
                    <RemoveAccessReqModal
                        {...modalProps}
                        title={"Отзыв прав"}
                        okText={"Отправить"}
                    />
                )}
            </Suspense>
        </Row>
    );
};
export default Requests;
