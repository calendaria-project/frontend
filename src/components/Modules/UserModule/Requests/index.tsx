import React, { FC, Suspense, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
    Space,
    Button,
    Dropdown,
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
import { MY_REQUESTS, BOOKING, selectReqValues } from "./defaultValues";
import {
    ALL,
    ALL_BOOKINGS,
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

import { appItemTypeValues } from "data/enums";
import { appTypesEnumTranscripts } from "data/transcripts";
import filterRequests from "utils/filterAccessRequests";
import getFullName from "utils/getFullName";
import { removeEmptyValuesFromAnyLevelObject } from "utils/removeObjectProperties";
import getObjectWithHandledDates from "utils/getObjectWithHandeledDates";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { AuthContext } from "context/AuthContextProvider";
import { getFormattedDateFromNow } from "utils/getFormattedDates";

const AddRequestModal = React.lazy(
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

    const [currUserData, setCurrUserData] = useState<IUsersViewModel>({} as IUsersViewModel);
    const userId = currUserData.userId;
    const [modalValues, setModalValues] = useState<ISimpleDictionaryViewModel[]>([]);
    const [reqModalVisible, setReqModalVisible] = useState(false);
    const [isAddReqFlag, setIsAddReqFlag] = useState(false);

    const [allRequests, setAllRequests] = useState<IAccessAppDataByCurrentUserViewModel>(
        {} as IAccessAppDataByCurrentUserViewModel
    );
    const [copiedRequests, setCopiedRequests] = useState<IAccessAppDataByCurrentUserViewModel>(
        {} as IAccessAppDataByCurrentUserViewModel
    );
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [selectReqValue, setSelectReqValue] = useState(
        sessionStorage.getItem("selectUserRequestsValue") || MY_REQUESTS
    );
    const [handlingValue, setHandlingValue] = useState("");

    const isBookingReq = selectReqValue === BOOKING;

    const [query, setQuery] = useState("");
    const { searchStr, handleFiltrationChange } = useDelayedInputSearch(query, setQuery);
    const { getAccessApplicationByCurrentUser, getCurrentUserData, getDictionaryValues } =
        useSimpleHttpFunctions();

    useEffect(() => {
        !isBookingReq
            ? setHandlingValue(sessionStorage.getItem("filterUserRequestsValue") || ALL)
            : setHandlingValue(sessionStorage.getItem("sortUserShowValue") || ALL_BOOKINGS);
    }, [isBookingReq]);

    useEffect(() => {
        initRequestsData();
    }, []);

    const initRequestsData = async () => {
        setLoadingRequests(true);
        const data = await getAccessApplicationByCurrentUser();
        setLoadingRequests(false);
        setAllRequests(data ?? {});
        setCopiedRequests(data);
    };

    useEffect(() => {
        initCurrUserData();
    }, []);

    useEffect(() => {
        initModalData();
    }, []);

    const initModalData = async () => {
        const data = await getDictionaryValues(`simple/${dictionaryCodesEnum.APP_ITEM_TYPE}`);
        setModalValues(data);
    };

    const initCurrUserData = async () => {
        const data = await getCurrentUserData();
        setCurrUserData(data);
    };

    console.log(allRequests);

    useEffect(() => {
        if (!isBookingReq && isObjectNotEmpty(copiedRequests)) {
            const searchedData: [string, IAccessAppDataByCurrentUserInKeyViewModel[]][] = searchStr
                ? Object.entries(copiedRequests).map(([key, allReqsInKey]) => {
                      return [
                          key,
                          allReqsInKey.filter((req) => {
                              const tableDataStr =
                                  (appTypesEnumTranscripts[req.appType] || "") +
                                  (getFormattedDateFromNow(req.createdAt) || "") +
                                  (getFormattedDateFromNow(req.endDate) || "") +
                                  (accessRequestTranscripts[req.status] || "");
                              return tableDataStr.toLowerCase().includes(searchStr.toLowerCase());
                          })
                      ];
                  })
                : Object.entries(copiedRequests);
            const searchedAndHandledData = accessShowValuesNamesArr.includes(handlingValue)
                ? searchedData //change for sort util foo
                : filterRequests(handlingValue, searchedData);
            setAllRequests(Object.fromEntries(searchedAndHandledData));
        }
    }, [searchStr, isBookingReq, copiedRequests, handlingValue]);

    const updateReqData = useCallback(
        (data: IAccessAppDataByCurrentUserViewModel) => {
            if (!isBookingReq) {
                setAllRequests(data);
                setCopiedRequests(data);
            }
        },
        [allRequests, copiedRequests, isBookingReq]
    );

    const handleChangeSelectReqValue = useCallback((v: string) => {
        sessionStorage.setItem("selectUserRequestsValue", v);
        setSelectReqValue(v);
    }, []);

    const handleChangeHandlingValue = useCallback(
        (v: string) => {
            if (!isBookingReq) {
                sessionStorage.setItem("filterUserRequestsValue", v);
            } else {
                sessionStorage.setItem("sortUserShowValue", v);
            }
            setHandlingValue(v);
        },
        [isBookingReq]
    );

    const onFinishAddReqModal = useCallback(
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

            const finalReqData: IAccessApplicationViewModel = {
                appType: filteredDataWithDate.appType,
                endDate: filteredDataWithDate.endDate,
                comment: filteredDataWithDate.comment || null,
                applicationUserId: userId,
                items: reqItems
            };

            console.log(finalReqData);

            actionMethodResultSync(
                "HELPDESK",
                "access-application",
                "post",
                getRequestHeader(authContext.token),
                finalReqData
            )
                .then((data: IAccessAppDataByCurrentUserInKeyViewModel) => {
                    message.success("Успешно создано");
                    form.resetFields();
                    setReqModalVisible(false);
                    updateReqData({
                        ...allRequests,
                        [accessRequestStatuses.ON_APPROVEMENT]: allRequests[
                            accessRequestStatuses.ON_APPROVEMENT
                        ]
                            ? [...allRequests[accessRequestStatuses.ON_APPROVEMENT], data]
                            : [data]
                    });
                })
                .catch(() => {
                    message.error("Ошибка создания!");
                });
        },
        [modalValues, allRequests, userId, updateReqData]
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
                    <Text className={classes.textForSelection}>Показать:</Text>
                    <Select
                        className={cx(classes.select, classes.handlingSelect)}
                        value={handlingValue}
                        onChange={handleChangeHandlingValue}
                    >
                        {(!isBookingReq ? accessReqStatuses : accessShowValues).map(
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
                    {!isBookingReq ? (
                        <Dropdown overlay={dropdownItems}>
                            <Button className={classes.btn}>
                                <Space>
                                    Создать
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    ) : (
                        <Button className={classes.btn} icon={<PlusOutlined />}>
                            Добавить
                        </Button>
                    )}
                </Col>
            </Row>
            {!isBookingReq ? (
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
                <AddRequestModal
                    form={form}
                    title={isAddReqFlag ? "Добавить и подписать заявку" : "Отзыв прав"}
                    isVisible={reqModalVisible}
                    setIsVisible={setReqModalVisible}
                    okText={isAddReqFlag ? "Добавить и подписать" : "Отправить"}
                    onFinish={onFinishAddReqModal}
                    userName={getFullName(
                        currUserData.firstname,
                        currUserData.lastname,
                        currUserData.patronymic
                    )}
                    modalValues={modalValues}
                    removeAccess={!isAddReqFlag}
                />
            </Suspense>
        </Row>
    );
};
export default Requests;
