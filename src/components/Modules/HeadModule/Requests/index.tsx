import React, { FC, useCallback, useEffect, useMemo, useState, Suspense, useContext } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import {
    accessRequestStatuses,
    appItemTypeValues,
    dictionaryCodesEnum,
    mainMenuEnum
} from "data/enums";
import { accessRequestTranscripts } from "data/transcripts";
import { useDispatch } from "react-redux";
import { useTheme } from "react-jss";
import {
    Col,
    Input,
    Row,
    Select,
    Typography,
    Menu,
    Dropdown,
    Space,
    Button,
    Form,
    message
} from "antd";

import useStyles from "./styles";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel,
    IAccessApplicationItemModel,
    IAccessApplicationViewModel,
    ISimpleDictionaryViewModel,
    IUsersViewModel
} from "interfaces";
import { SearchOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import { BOOKING, OUTGOING, selectReqValues } from "./defaultValues";
import { ALL_BOOKINGS, DATE, sortAccessReqValues, sortAccessShowValues } from "data/constants";
import cx from "classnames";
import ReqTable from "./ReqTable";
import Spinner from "ui/Spinner";
import { ITheme } from "styles/theme/interface";
import useDelayedInputSearch from "hooks/useDelayedInputSearch";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";

import { appTypesEnumTranscripts } from "data/transcripts";
import sortRequests from "utils/sortAccessRequests";
import getFullName from "utils/getFullName";
import { getFormattedDateFromNow } from "utils/getFormattedDates";
import { IUsersWithInfoModel } from "interfaces/extended";
import { removeEmptyValuesFromAnyLevelObject } from "utils/removeObjectProperties";
import getObjectWithHandledDates from "utils/getObjectWithHandeledDates";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { AuthContext } from "context/AuthContextProvider";

const AccessReqModal = React.lazy(
    () => import("components/Shared/modalRenderer/ReadyModals/AccessReqModal")
);
const { Option } = Select;
const { Text } = Typography;

const Requests: FC = () => {
    const authContext = useContext(AuthContext);
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
    const [sortValue, setSortValue] = useState("");

    const isBooking = selectReqValue === BOOKING;

    const [query, setQuery] = useState("");
    const { searchStr, handleFiltrationChange } = useDelayedInputSearch(query, setQuery);
    const {
        getOutgoingAccessApplication,
        getIncomingAccessApplication,
        getUsersWithPhotoId,
        getCurrentUserData,
        getUsersByCompanyId,
        getDictionaryValues
    } = useSimpleHttpFunctions();

    useEffect(() => {
        !isBooking
            ? setSortValue(sessionStorage.getItem("sortHeadRequestsValue") || DATE)
            : setSortValue(sessionStorage.getItem("sortHeadShowValue") || ALL_BOOKINGS);
    }, [isBooking]);

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
                                  (getFormattedDateFromNow(req.endDate) || "") +
                                  (accessRequestTranscripts[req.status] || "");
                              return reqDataStr.toLowerCase().includes(searchStr.toLowerCase());
                          })
                      ];
                  })
                : Object.entries(copiedRequests);
            const searchedAndSortedData = sortRequests(sortValue, searchedData);
            setAllRequests(Object.fromEntries(searchedAndSortedData));
        }
    }, [searchStr, isBooking, copiedRequests, sortValue]);

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

    const handleChangeSortValue = useCallback(
        (v: string) => {
            if (!isBooking) {
                sessionStorage.setItem("sortHeadRequestsValue", v);
            } else {
                sessionStorage.setItem("sortHeadShowValue", v);
            }
            setSortValue(v);
        },
        [isBooking]
    );

    const onFinishReqModal = useCallback(
        (data: any) => {
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

            const finalReqData: IAccessApplicationViewModel = {
                appType: filteredDataWithDate.appType,
                endDate: filteredDataWithDate.endDate,
                comment: filteredDataWithDate.comment || null,
                applicationUserId: filteredDataWithDate.applicationUserId,
                items: reqItems
            };

            actionMethodResultSync(
                "HELPDESK",
                "access-application",
                "post",
                getRequestHeader(authContext.token),
                finalReqData
            )
                .then((d) => {
                    message.success("Успешно создано");
                    console.log(d);
                    form.resetFields();
                    setReqModalVisible(false);
                    updateReqData({
                        ...allRequests,
                        [accessRequestStatuses.ON_APPROVEMENT]: allRequests[
                            accessRequestStatuses.ON_APPROVEMENT
                        ]
                            ? [...allRequests[accessRequestStatuses.ON_APPROVEMENT], d]
                            : [d]
                    });
                })
                .catch(() => {
                    message.error("Ошибка создания!");
                });
        },
        [modalValues, allRequests, updateReqData]
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
                    <Text className={classes.textForSelection}>
                        {!isBooking ? "Сортировать по:" : "Показать:"}
                    </Text>
                    <Select
                        className={cx(classes.select, classes.sortSelect)}
                        value={sortValue}
                        onChange={handleChangeSortValue}
                    >
                        {(!isBooking ? sortAccessReqValues : sortAccessShowValues).map(
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
                        currentUserId={currentUser?.userId}
                        reqData={allRequests}
                        updateReqData={updateReqData}
                    />
                )
            ) : (
                <></>
            )}
            <Suspense>
                <AccessReqModal
                    form={form}
                    title={isAddReqFlag ? "Добавить заявку" : "Отзыв прав"}
                    isVisible={reqModalVisible}
                    setIsVisible={setReqModalVisible}
                    okText={isAddReqFlag ? "Добавить" : "Отправить"}
                    onFinish={onFinishReqModal}
                    usersData={allUsers}
                    modalValues={modalValues}
                    removeAccess={!isAddReqFlag}
                />
            </Suspense>
        </Row>
    );
};
export default Requests;
