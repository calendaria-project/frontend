import React, { FC, useCallback, useEffect, useMemo, useState, Suspense, useContext } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { accessRequestStatuses, dictionaryCodesEnum, mainMenuEnum } from "data/enums";
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
    ISimpleDictionaryViewModel,
    IUsersViewModel
} from "interfaces";
import { SearchOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import { BOOKING, OUTGOING, selectReqValues } from "./defaultValues";
import {
    accessReqStatuses,
    accessShowValues,
    ALL_BOOKINGS,
    ALL,
    accessShowValuesNamesArr
} from "data/constants";
import cx from "classnames";
import ReqTable from "./ReqTable";
import Spinner from "ui/Spinner";
import { ITheme } from "styles/theme/interface";
import useDelayedInputSearch from "hooks/useDelayedInputSearch";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";

import { appTypesEnumTranscripts } from "data/transcripts";
import filterRequests from "utils/filterAccessRequests";
import getFullName from "utils/getFullName";
import { getFormattedDateFromNow } from "utils/getFormattedDates";
import { IUsersWithInfoModel } from "interfaces/extended";
import { getRequestHeader } from "functions/common";
import { AuthContext } from "context/AuthContextProvider";
import axios from "axios";
import getParsedRequestData from "utils/getParsedRequestData";

const AccessReqModal = React.lazy(() => import("components/Shared/Requests/modals/AccessReqModal"));
const RemoveAccessReqModal = React.lazy(
    () => import("components/Shared/Requests/modals/RemoveAccessReqModal")
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

    const [reqModalVisible, setReqModalVisible] = useState(false);

    const [allRequests, setAllRequests] = useState<IAccessAppDataByCurrentUserViewModel>(
        {} as IAccessAppDataByCurrentUserViewModel
    );
    const [copiedRequests, setCopiedRequests] = useState<IAccessAppDataByCurrentUserViewModel>(
        {} as IAccessAppDataByCurrentUserViewModel
    );
    const [loadingRequests, setLoadingRequests] = useState(false);

    const [selectReqValue, setSelectReqValue] = useState(
        sessionStorage.getItem("selectManagerRequestsValue") || OUTGOING
    );
    const [handlingValue, setHandlingValue] = useState("");

    const isBooking = selectReqValue === BOOKING;

    useEffect(() => {
        !isBooking
            ? setHandlingValue(sessionStorage.getItem("filterManagerRequestsValue") || ALL)
            : setHandlingValue(sessionStorage.getItem("sortManagerShowValue") || ALL_BOOKINGS);
    }, [isBooking]);

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
        initModalData();
    }, []);

    const initModalData = async () => {
        const data = await getDictionaryValues(`simple/${dictionaryCodesEnum.APP_ITEM_TYPE}`);
        setModalValues(data);
    };

    useEffect(() => {
        initAllUsersData();
    }, []);

    const initAllUsersData = async () => {
        const currUserData: IUsersViewModel = await getCurrentUserData();
        const company = currUserData.company;
        if (company) {
            const usersData: IUsersViewModel[] = await getUsersByCompanyId(company.companyId);
            const usersDataWithFullName = usersData.map((user) => ({
                ...user,
                fullName: getFullName(user.firstname, user.lastname, user.patronymic)
            }));
            setAllUsers(usersDataWithFullName);
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
        [allRequests, copiedRequests]
    );

    const handleChangeSelectReqValue = useCallback((v: string) => {
        sessionStorage.setItem("selectManagerRequestsValue", v);
        setSelectReqValue(v);
    }, []);

    const handleChangeHandlingValue = useCallback(
        (v: string) => {
            if (!isBooking) {
                sessionStorage.setItem("filterManagerRequestsValue", v);
            } else {
                sessionStorage.setItem("sortManagerShowValue", v);
            }
            setHandlingValue(v);
        },
        [isBooking]
    );

    const onFinishReqModal = useCallback(
        (data: any) => {
            const finalReqData = getParsedRequestData(data, modalValues);
            axios
                .post(
                    `${process.env.HELPDESK_URL}access-application`,
                    finalReqData,
                    getRequestHeader(authContext.token)
                )
                .then((record) => {
                    const d = record.data;
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
                .catch((e) => {
                    if (e.response?.data?.message === "PROCESS_HEAD_USER_NOT_FOUND") {
                        message.error("Не найден управлющий процессом!");
                    } else {
                        message.error("Ошибка создания!");
                    }
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

    const modalProps = {
        form,
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
                    <ReqTable reqData={allRequests} updateReqData={updateReqData} />
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
