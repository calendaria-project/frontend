import { Card, Col, Form, Menu, MenuProps, message, Row } from "antd";
import React, { FC, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import {
    additionalMenuTypes,
    arrayKeyTypes,
    inputData,
    SelectedKeyTypes,
    TInputData
} from "./constants";
import {
    CarOutlined,
    CodeSandboxOutlined,
    ContactsOutlined,
    EditOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    FormOutlined,
    InfoCircleOutlined,
    KeyOutlined,
    PlusOutlined,
    UserOutlined
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "hooks/useTypedSelector";

import UserExtraCardModal from "./modal";
import { getUserEditingNameByKey } from "utils/getUserEditingNameByKey";

import RowData, { ListedRowData } from "./RowData";
import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { getCurrentUserDataItemInfo, getSelectedKey } from "store/reducers/userReducer";
import { removeEmptyObjectProperties } from "utils/removeObjectProperties";

import { SetCurrentUserDataItemInfo, SetUserSelectedKey } from "store/actions";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import getUserRequestUrl from "functions/getUserRequestUrl";
import SimpleUserExtraCardAdditionalModal from "./modal/simpleAdditionalModal";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import getObjectWithHandledDates from "utils/getObjectWithHandeledDates";

interface IUserExtraCard {
    usersId: string;
}

const UserExtraCard: FC<IUserExtraCard> = ({ usersId }) => {
    const authContext = useContext(AuthContext);
    const dispatch = useDispatch();

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const selectedKey = useTypedSelector((state) => getSelectedKey(state.user));
    const currentUserDataItemInfo = useTypedSelector((state) =>
        getCurrentUserDataItemInfo(state.user)
    );

    const userMenuDataExists: boolean = isObjectNotEmpty(currentUserDataItemInfo);
    const additionalMenuExists: boolean = additionalMenuTypes.includes(selectedKey);

    const [form] = Form.useForm();
    const [simpleForm] = Form.useForm();
    const [modalVisibleFlag, setModalVisibleFlag] = useState<boolean>(false);
    const [additionalModalVisibleFlag, setAdditionalModalVisibleFlag] = useState<boolean>(false);

    const [currentDataLayout, setCurrentDataLayout] = useState<Array<TInputData>>(
        inputData?.[selectedKey]
    );

    useEffect(() => {
        dispatch(SetUserSelectedKey(SelectedKeyTypes.USER));
    }, [usersId]);

    useEffect(() => {
        setCurrentDataLayout(inputData[selectedKey]);
    }, [selectedKey]);

    useEffect(() => {
        if (selectedKey !== SelectedKeyTypes.SHARED_INFO) {
            const url = getUserRequestUrl(selectedKey, "get", usersId);
            actionMethodResultSync("USER", url, "get", getRequestHeader(authContext.token)).then(
                (res) => {
                    if (isObjectNotEmpty(res)) {
                        dispatch(SetCurrentUserDataItemInfo({ [selectedKey]: res }));
                    }
                }
            );
        }
    }, [dispatch, selectedKey]);

    const handleMenuClick: MenuProps["onClick"] = useCallback(
        (e: any) => {
            dispatch(SetUserSelectedKey(e.key));
        },
        [dispatch]
    );

    const handleIconClick = useCallback(() => {
        setModalVisibleFlag(true);
    }, []);

    const handleAdditionalIconClick = useCallback(() => {
        setAdditionalModalVisibleFlag(true);
    }, []);

    const getIcon = (currentKey: string, Icon?: JSX.Element): JSX.Element => {
        return (
            <>
                {Icon ? Icon : <></>}
                {selectedKey === currentKey && arrayKeyTypes.includes(currentKey) ? (
                    <PlusOutlined onClick={handleAdditionalIconClick} className={classes.icon} />
                ) : (
                    selectedKey === currentKey &&
                    (userMenuDataExists ? (
                        <EditOutlined onClick={handleIconClick} className={classes.icon} />
                    ) : (
                        <PlusOutlined onClick={handleIconClick} className={classes.icon} />
                    ))
                )}
            </>
        );
    };

    const saveModal = useCallback(
        (record: any) => {
            const recordWithDates = getObjectWithHandledDates(record);
            const reqMethod = isObjectNotEmpty(currentUserDataItemInfo) ? "put" : "post";

            const sendRequest = (data: Object) => {
                actionMethodResultSync(
                    "USER",
                    getUserRequestUrl(selectedKey, reqMethod, usersId),
                    reqMethod,
                    getRequestHeader(authContext.token),
                    data
                )
                    .then((res) => {
                        dispatch(SetCurrentUserDataItemInfo({ [selectedKey]: res }));
                        message.success("Успешно сохранено");
                    })
                    .catch((err) => {
                        console.log(err);
                        message.error("Ошибка");
                    });
            };

            if (reqMethod === "post") {
                const data = removeEmptyObjectProperties({ ...recordWithDates, userId: usersId });
                console.log("DATA", data);
                sendRequest(data);
            } else {
                const data = _.merge(currentUserDataItemInfo, recordWithDates);
                console.log("DATA", data);
                sendRequest(data);
            }

            setModalVisibleFlag(false);
            form.resetFields();
        },
        [form, currentUserDataItemInfo, selectedKey, usersId]
    );

    const saveAdditionalModal = useCallback(
        (record: any) => {
            const recordWithDates = getObjectWithHandledDates(record);
            const reqMethod = "post";

            console.log(recordWithDates);

            const sendRequest = (data: Object) => {
                actionMethodResultSync(
                    "USER",
                    getUserRequestUrl(selectedKey, reqMethod, usersId),
                    reqMethod,
                    getRequestHeader(authContext.token),
                    data
                )
                    .then((res) => {
                        console.log(res);
                        const currentData = isObjectNotEmpty(currentUserDataItemInfo)
                            ? [...currentUserDataItemInfo, res]
                            : [res];
                        dispatch(SetCurrentUserDataItemInfo({ [selectedKey]: currentData }));
                        message.success("Успешно сохранено");
                    })
                    .catch((err) => {
                        console.log(err);
                        message.error("Ошибка");
                    });
            };

            const data = removeEmptyObjectProperties({ ...recordWithDates, userId: usersId });
            sendRequest(data);

            setAdditionalModalVisibleFlag(false);
            simpleForm.resetFields();
        },
        [simpleForm, currentUserDataItemInfo, selectedKey, usersId]
    );

    const items: MenuProps["items"] = [
        {
            key: SelectedKeyTypes.USER,
            icon: <KeyOutlined />,
            label: "Учетная запись"
        },
        {
            key: SelectedKeyTypes.CONTACT_PERSONAL,
            icon: getIcon(SelectedKeyTypes.CONTACT_PERSONAL, <UserOutlined />),
            label: "Контакты"
        },
        {
            key: SelectedKeyTypes.CONTACT_BUSINESS,
            icon: getIcon(SelectedKeyTypes.CONTACT_BUSINESS, <ContactsOutlined />),
            label: "Организация"
        },
        {
            key: SelectedKeyTypes.INVENTORY,
            icon: getIcon(SelectedKeyTypes.INVENTORY, <CodeSandboxOutlined />),
            label: "Инвентарь"
        },
        {
            key: SelectedKeyTypes.DOCUMENT,
            icon: getIcon(SelectedKeyTypes.DOCUMENT, <FileTextOutlined />),
            label: "Документы"
        },
        {
            key: SelectedKeyTypes.ADDRESS_INFO,
            icon: getIcon(SelectedKeyTypes.ADDRESS_INFO, <EnvironmentOutlined />),
            label: "Адрес"
        },
        {
            key: SelectedKeyTypes.CAR_INFO,
            icon: getIcon(SelectedKeyTypes.CAR_INFO, <CarOutlined />),
            label: "Автомобиль"
        },
        {
            key: SelectedKeyTypes.CONTRACT,
            icon: getIcon(SelectedKeyTypes.CONTRACT, <FormOutlined />),
            label: "Договора"
        },
        {
            key: SelectedKeyTypes.SHARED_INFO,
            icon: <InfoCircleOutlined />,
            label: "Информация"
        }
    ];
    const memoizedItems = useMemo(() => items, [items]);

    const additionalItems: MenuProps["items"] = [
        {
            key: SelectedKeyTypes.ADDITIONAL_INFO,
            icon: getIcon(SelectedKeyTypes.ADDITIONAL_INFO),
            label: "О себе"
        },
        {
            key: SelectedKeyTypes.LANGUAGE_KNOWLEDGE,
            icon: getIcon(SelectedKeyTypes.LANGUAGE_KNOWLEDGE),
            label: "Иностранные языки"
        },
        {
            key: SelectedKeyTypes.EDUCATION,
            icon: getIcon(SelectedKeyTypes.EDUCATION),
            label: "Образование"
        },
        {
            key: SelectedKeyTypes.RELATIONSHIP,
            icon: getIcon(SelectedKeyTypes.RELATIONSHIP),
            label: "Родственные связи"
        },
        {
            key: SelectedKeyTypes.MILITARY_INFO,
            icon: getIcon(SelectedKeyTypes.MILITARY_INFO),
            label: "Воинский учет"
        }
    ];
    const memoizedAdditionalItems = useMemo(() => additionalItems, [additionalItems]);

    const arrayTypesFlag = useMemo(() => arrayKeyTypes.includes(selectedKey), [selectedKey]);

    const modalTitle = useMemo(
        () =>
            `${userMenuDataExists ? "Редактировать" : "Добавить"} ${getUserEditingNameByKey(
                selectedKey
            )}`,
        [selectedKey, userMenuDataExists]
    );
    const additionalModalTitle = useMemo(
        () => `Добавить ${getUserEditingNameByKey(selectedKey)}`,
        [selectedKey]
    );

    return (
        <Card className={classes.extraCard} title="Дополнительная информация">
            <Form form={form} component={false}>
                <Row className="row-wrapper">
                    <Col span={6}>
                        <Menu
                            mode="inline"
                            selectedKeys={[selectedKey]}
                            onClick={handleMenuClick}
                            items={memoizedItems}
                        />
                    </Col>
                    {additionalMenuExists && (
                        <Col span={6}>
                            <Menu
                                mode="inline"
                                selectedKeys={[selectedKey]}
                                onClick={handleMenuClick}
                                items={memoizedAdditionalItems}
                            />
                        </Col>
                    )}
                    <Col span={additionalMenuExists ? 12 : 18}>
                        <Row className={classes.rowDataContainer} gutter={[6, 6]}>
                            {!arrayTypesFlag ? (
                                currentDataLayout ? (
                                    currentDataLayout.map((dataItem, index) => (
                                        <RowData key={index} dataItem={dataItem} />
                                    ))
                                ) : null
                            ) : (
                                <ListedRowData
                                    currentDataLayout={currentDataLayout}
                                    usersId={usersId}
                                />
                            )}
                        </Row>
                    </Col>
                </Row>
                <UserExtraCardModal
                    okText={"Сохранить"}
                    title={modalTitle}
                    isVisible={modalVisibleFlag}
                    setIsVisible={setModalVisibleFlag}
                    onFinish={saveModal}
                    form={form}
                    currentDataLayout={currentDataLayout}
                />
                <SimpleUserExtraCardAdditionalModal
                    okText={"Сохранить"}
                    title={additionalModalTitle}
                    isVisible={additionalModalVisibleFlag}
                    setIsVisible={setAdditionalModalVisibleFlag}
                    onFinish={saveAdditionalModal}
                    form={simpleForm}
                    currentDataLayout={currentDataLayout}
                />
            </Form>
        </Card>
    );
};
export default memo(UserExtraCard);
