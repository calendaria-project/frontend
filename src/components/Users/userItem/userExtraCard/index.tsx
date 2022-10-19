import { Card, Col, Form, Menu, MenuProps, message, Row } from "antd";
import React, { FC, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { SelectedKeyTypes, TInputData, inputData } from "./constants";
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
    UserOutlined,
    GlobalOutlined,
    BellOutlined
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "hooks/useTypedSelector";

import UserExtraCardModal from "./modal";
import { getUserEditingNameByKey } from "utils/getUserEditingNameByKey";

import "./styles.scss";
import RowData from "./RowData";
import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { getCurrentUserDataItemInfo, getSelectedKey } from "store/reducers/userReducer";
import { removeEmptyObjectProperties } from "utils/removeEmptyObjectProperties";

import { SetCurrentUserDataItemInfo, SetUserSelectedKey } from "store/actions";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";

interface IUserExtraCard {
    usersId: string;
}

const UserExtraCard: FC<IUserExtraCard> = ({ usersId }) => {
    const authContext = useContext(AuthContext);
    const dispatch = useDispatch();

    const selectedKey = useTypedSelector((state) => getSelectedKey(state.user));
    const currentUserDataItemInfo = useTypedSelector((state) =>
        getCurrentUserDataItemInfo(state.user)
    );
    const userMenuDataExists: boolean = isObjectNotEmpty(currentUserDataItemInfo);

    const title = useMemo(
        () =>
            `${userMenuDataExists ? "Редактировать" : "Добавить"} ${getUserEditingNameByKey(
                selectedKey
            )}`,
        [selectedKey, userMenuDataExists]
    );

    const [form] = Form.useForm();
    const [modalVisibleFlag, setModalVisibleFlag] = useState<boolean>(false);

    const [currentDataLayout, setCurrentDataLayout] = useState<Array<TInputData>>(
        inputData[selectedKey]
    );

    useEffect(() => {
        setCurrentDataLayout(inputData[selectedKey]);
    }, [selectedKey]);

    useEffect(() => {
        const url = `${
            selectedKey === SelectedKeyTypes.CONTACT_PERSONAL ||
            selectedKey === SelectedKeyTypes.CONTACT_BUSINESS
                ? "contact"
                : selectedKey
        }/${usersId}${
            selectedKey === SelectedKeyTypes.CONTACT_PERSONAL
                ? "/personal"
                : selectedKey === SelectedKeyTypes.CONTACT_BUSINESS
                ? "/business"
                : ""
        }`;

        actionMethodResultSync("USER", url, "get", getRequestHeader(authContext.token)).then(
            (res) => {
                if (isObjectNotEmpty(res)) {
                    dispatch(SetCurrentUserDataItemInfo({ [selectedKey]: res }));
                }
            }
        );
    }, [dispatch, usersId, selectedKey]);

    const handleMenuClick: MenuProps["onClick"] = useCallback(
        (e: any) => {
            // console.log(e.key);
            dispatch(SetUserSelectedKey(e.key));
        },
        [dispatch]
    );

    const onSetModalVisibleFlag = useCallback((bool: boolean) => {
        setModalVisibleFlag(bool);
    }, []);

    const handleIconClick = useCallback(() => {
        setModalVisibleFlag(true);
    }, []);

    const getIcon = (currentKey: string, Icon: JSX.Element): JSX.Element => {
        return (
            <>
                {Icon}
                {selectedKey === currentKey &&
                    (userMenuDataExists ? (
                        <EditOutlined onClick={handleIconClick} className="icon" />
                    ) : (
                        <PlusOutlined onClick={handleIconClick} className="icon" />
                    ))}
            </>
        );
    };

    const save = useCallback(
        (record: any) => {
            const reqMethod = isObjectNotEmpty(currentUserDataItemInfo) ? "put" : "post";

            const sendRequest = (data: Object) => {
                const currentSelectedKey =
                    selectedKey === SelectedKeyTypes.CONTACT_PERSONAL ||
                    selectedKey === SelectedKeyTypes.CONTACT_BUSINESS
                        ? "contact"
                        : selectedKey;
                const url = `${currentSelectedKey}${
                    currentSelectedKey === "contact" && reqMethod === "post" ? `/${usersId}` : ""
                }${
                    selectedKey === SelectedKeyTypes.CONTACT_PERSONAL
                        ? "/personal"
                        : selectedKey === SelectedKeyTypes.CONTACT_BUSINESS
                        ? "/business"
                        : ""
                }`;

                actionMethodResultSync(
                    "USER",
                    url,
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
                const data =
                    record instanceof Array
                        ? record.map((item) => ({
                              ...removeEmptyObjectProperties(item),
                              userId: usersId
                          }))
                        : removeEmptyObjectProperties({ ...record, userId: usersId });
                sendRequest(data);
            } else {
                if (currentUserDataItemInfo instanceof Array) {
                    //доделать
                    if (!_.isEqual(currentUserDataItemInfo, [])) {
                        if (selectedKey === SelectedKeyTypes.EDUCATION) {
                            const data: Array<Object> = [];
                            currentUserDataItemInfo.forEach((dataItemInfo) => {
                                if (dataItemInfo.educationId === record?.educationId) {
                                    data.push({ ...dataItemInfo, ...record });
                                } else {
                                    data.push(dataItemInfo);
                                }
                            });
                            sendRequest(data);
                        } else if (selectedKey === SelectedKeyTypes.LANGUAGE_KNOWLEDGE) {
                            const data: Array<Object> = [];
                            currentUserDataItemInfo.forEach((dataItemInfo) => {
                                if (
                                    dataItemInfo.languageKnowledgeId === record?.languageKnowledgeId
                                ) {
                                    data.push({ ...dataItemInfo, ...record });
                                } else {
                                    data.push(dataItemInfo);
                                }
                            });
                            sendRequest(data);
                        } else if (
                            selectedKey === SelectedKeyTypes.INVENTORY ||
                            selectedKey === SelectedKeyTypes.DOCUMENT
                        ) {
                            const dataObject = currentUserDataItemInfo?.[0] ?? {};
                            const data = _.merge(dataObject, record);
                            sendRequest(data);
                        }
                    }
                } else {
                    const data = _.merge(currentUserDataItemInfo, record);
                    sendRequest(data);
                }
            }

            setModalVisibleFlag(false);
        },
        [currentUserDataItemInfo, selectedKey, usersId]
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
            key: SelectedKeyTypes.ADDITIONAL_INFO,
            icon: getIcon(SelectedKeyTypes.ADDITIONAL_INFO, <InfoCircleOutlined />),
            label: "Информация"
        },
        {
            key: SelectedKeyTypes.LANGUAGE_KNOWLEDGE,
            icon: getIcon(SelectedKeyTypes.LANGUAGE_KNOWLEDGE, <GlobalOutlined />),
            label: "Иностранные языки"
        },
        {
            key: SelectedKeyTypes.EDUCATION,
            icon: getIcon(SelectedKeyTypes.EDUCATION, <BellOutlined />),
            label: "Образование"
        }
    ];

    const memoizedItems = useMemo(() => items, [items]);

    return (
        <Card className={"userItem__extraCard"} title="Дополнительная информация">
            <Form form={form} component={false}>
                <Row className="row-wrapper">
                    <Col span={8}>
                        <Menu
                            mode="inline"
                            selectedKeys={[selectedKey]}
                            onClick={handleMenuClick}
                            items={memoizedItems}
                        />
                    </Col>
                    <Col span={16}>
                        <Row className="row-container" gutter={[16, 16]}>
                            {currentDataLayout
                                ? currentDataLayout.map((dataItem, index) => (
                                      <RowData key={index} dataItem={dataItem} usersId={usersId} />
                                  ))
                                : null}
                        </Row>
                    </Col>
                </Row>
                <UserExtraCardModal
                    okText={"Сохранить"}
                    title={title}
                    isVisible={modalVisibleFlag}
                    setIsVisible={onSetModalVisibleFlag}
                    onFinish={save}
                    form={form}
                    currentDataLayout={currentDataLayout}
                />
            </Form>
        </Card>
    );
};
export default memo(UserExtraCard);
