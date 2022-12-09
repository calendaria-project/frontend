import { Card, Col, Form, Menu, MenuProps, message, Row } from "antd";
import React, { FC, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { additionalMenuTypes, arrayKeyTypes, modalData } from "./constants";
import { TLayoutModalData } from "data/types";
import { selectedKeyTypes } from "data/enums";
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
import { IErrorDetail, modalErrorCodes, errorCodes, IErrorModifiedItem } from "data/errorCodes";

import UserExtraCardModal from "./modal";
import { getModalEditingNameByKey } from "utils/getModalEditingNameByKey";

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
import axios from "axios";
import getCurrentSimpleError from "utils/getCurrentSimpleError";

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

    const [currentDataLayout, setCurrentDataLayout] = useState<TLayoutModalData[]>(
        modalData?.[selectedKey]
    );

    const [errorMessages, setErrorMessages] = useState<string>("");
    const [errorArr, setErrorArr] = useState<IErrorModifiedItem[]>([]);

    useEffect(() => {
        dispatch(SetUserSelectedKey(selectedKeyTypes.USER));
    }, [usersId]);

    useEffect(() => {
        setCurrentDataLayout(modalData[selectedKey]);
    }, [selectedKey]);

    useEffect(() => {
        if (selectedKey !== selectedKeyTypes.SHARED_INFO) {
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
            const { salaryConstantPart, salaryVariablePart, ...modifiedRecord } = recordWithDates;
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
                const data = removeEmptyObjectProperties({ ...modifiedRecord, userId: usersId });
                console.log("DATA", data);
                sendRequest(data);
            } else {
                const data = _.merge(currentUserDataItemInfo, modifiedRecord);
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
            const { salaryConstantPart, salaryVariablePart, ...modifiedRecord } = recordWithDates;

            const sendRequest = (data: Object) => {
                console.log(data);
                const url = `${process.env.USER_URL}${getUserRequestUrl(
                    selectedKey,
                    "post",
                    usersId
                )}`;
                axios
                    .post(url, data, getRequestHeader(authContext.token))
                    .then((res) => {
                        let currentData;
                        const result = res.data;
                        if (result instanceof Object && !(result instanceof Array)) {
                            isObjectNotEmpty(currentUserDataItemInfo)
                                ? (currentData = [...currentUserDataItemInfo, result])
                                : (currentData = [result]);
                        } else if (result instanceof Array) {
                            isObjectNotEmpty(currentUserDataItemInfo)
                                ? (currentData = [...currentUserDataItemInfo, ...result])
                                : (currentData = [...result]);
                        }
                        dispatch(SetCurrentUserDataItemInfo({ [selectedKey]: currentData }));
                        message.success("Успешно сохранено");

                        setErrorMessages("");
                        setErrorArr([]);
                        setAdditionalModalVisibleFlag(false);
                        simpleForm.resetFields();
                    })
                    .catch((err) => {
                        const errData = err.response?.data;
                        if (errData?.code === "VALIDATION_ERROR") {
                            const errorDetails: IErrorDetail[] = errData?.details;
                            console.log(errData);
                            message.error("Ошибка валидации");
                            let errMsgs = "Отсутствуют: ";
                            let errModals: IErrorModifiedItem[] = [];
                            (errorDetails || []).forEach((detail, index) => {
                                index !== errorDetails.length - 1
                                    ? (errMsgs += errorCodes[detail.errorCode] + ", ")
                                    : (errMsgs += errorCodes[detail.errorCode]);
                                if (modalErrorCodes.includes(detail.errorCode)) {
                                    errModals.push({
                                        selectedKey:
                                            detail.entity.slice(0, 1).toLowerCase() +
                                            detail.entity.slice(1),
                                        id: detail.entityId,
                                        field: detail.field,
                                        addText: "Добавить"
                                    });
                                }
                            });
                            setErrorMessages(errMsgs);
                            setErrorArr(errModals);
                            console.log(errMsgs, errModals);
                        } else {
                            let currErr = getCurrentSimpleError(err.response?.data?.code);
                            message.error(currErr ? currErr : "Ошибка");
                            setAdditionalModalVisibleFlag(false);
                            simpleForm.resetFields();
                        }
                    });
            };

            const data = removeEmptyObjectProperties({ ...modifiedRecord, userId: usersId });
            sendRequest(data);
        },
        [simpleForm, currentUserDataItemInfo, selectedKey, usersId]
    );

    const items: MenuProps["items"] = [
        {
            key: selectedKeyTypes.USER,
            icon: <KeyOutlined />,
            label: "Учетная запись"
        },
        {
            key: selectedKeyTypes.CONTACT_PERSONAL,
            icon: getIcon(selectedKeyTypes.CONTACT_PERSONAL, <UserOutlined />),
            label: "Контакты"
        },
        {
            key: selectedKeyTypes.CONTACT_BUSINESS,
            icon: getIcon(selectedKeyTypes.CONTACT_BUSINESS, <ContactsOutlined />),
            label: "Организация"
        },
        {
            key: selectedKeyTypes.INVENTORY,
            icon: getIcon(selectedKeyTypes.INVENTORY, <CodeSandboxOutlined />),
            label: "Инвентарь"
        },
        {
            key: selectedKeyTypes.DOCUMENT,
            icon: getIcon(selectedKeyTypes.DOCUMENT, <FileTextOutlined />),
            label: "Документы"
        },
        {
            key: selectedKeyTypes.ADDRESS_INFO,
            icon: getIcon(selectedKeyTypes.ADDRESS_INFO, <EnvironmentOutlined />),
            label: "Адрес"
        },
        {
            key: selectedKeyTypes.CAR_INFO,
            icon: getIcon(selectedKeyTypes.CAR_INFO, <CarOutlined />),
            label: "Автомобиль"
        },
        {
            key: selectedKeyTypes.CONTRACT,
            icon: getIcon(selectedKeyTypes.CONTRACT, <FormOutlined />),
            label: "Договора"
        },
        {
            key: selectedKeyTypes.SHARED_INFO,
            icon: <InfoCircleOutlined />,
            label: "Информация"
        }
    ];
    const memoizedItems = useMemo(() => items, [items]);

    const additionalItems: MenuProps["items"] = [
        {
            key: selectedKeyTypes.ADDITIONAL_INFO,
            icon: getIcon(selectedKeyTypes.ADDITIONAL_INFO),
            label: "О себе"
        },
        {
            key: selectedKeyTypes.LANGUAGE_KNOWLEDGE,
            icon: getIcon(selectedKeyTypes.LANGUAGE_KNOWLEDGE),
            label: "Иностранные языки"
        },
        {
            key: selectedKeyTypes.EDUCATION,
            icon: getIcon(selectedKeyTypes.EDUCATION),
            label: "Образование"
        },
        {
            key: selectedKeyTypes.RELATIONSHIP,
            icon: getIcon(selectedKeyTypes.RELATIONSHIP),
            label: "Родственные связи"
        },
        {
            key: selectedKeyTypes.MILITARY_INFO,
            icon: getIcon(selectedKeyTypes.MILITARY_INFO),
            label: "Воинский учет"
        }
    ];
    const memoizedAdditionalItems = useMemo(() => additionalItems, [additionalItems]);

    const arrayTypesFlag = useMemo(() => arrayKeyTypes.includes(selectedKey), [selectedKey]);

    const modalTitle = useMemo(
        () =>
            `${userMenuDataExists ? "Редактировать" : "Добавить"} ${getModalEditingNameByKey(
                selectedKey
            )}`,
        [selectedKey, userMenuDataExists]
    );
    const additionalModalTitle = useMemo(
        () => `Добавить ${getModalEditingNameByKey(selectedKey)}`,
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
                    errorMsg={errorMessages}
                    errorArr={errorArr}
                    usersId={usersId}
                />
            </Form>
        </Card>
    );
};
export default memo(UserExtraCard);
