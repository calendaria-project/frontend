import { Col, Form, FormInstance, message, Modal, Row } from "antd";

import Button from "ui/Button";

import React, { FC, memo, useCallback, useContext, useEffect, useState } from "react";

import { validateMessages } from "data/validateMessages";

import { IErrorModifiedItem } from "../../../errorCodes";
import { inputData, SelectedKeyTypes, TInputData } from "../../../constants";
import { useTheme } from "react-jss";
import useStyles from "../styles";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { AuthContext } from "context/AuthContextProvider";
import { getFormItemContent, WithFormItem } from "../../index";
import getObjectWithHandledDates from "utils/getObjectWithHandeledDates";
import _ from "lodash";
import { removeEmptyObjectProperties } from "utils/removeObjectProperties";

interface IExtraValidationModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    form: FormInstance;
    currentErr: IErrorModifiedItem;
    onChangeErrors: (index: number, currentErr: IErrorModifiedItem) => void;
    editingIndex: number;
    usersId: string;
}

const ExtraValidationModal: FC<IExtraValidationModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    form,
    onChangeErrors,
    currentErr,
    editingIndex,
    usersId
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const authContext = useContext(AuthContext);

    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    const currentDataLayout: TInputData[] = inputData[currentErr?.selectedKey];
    const [currentData, setCurrentData] = useState<any>(undefined);

    const entity = (currentErr?.selectedKey || "").includes("address")
        ? SelectedKeyTypes.ADDRESS_INFO
        : (currentErr?.selectedKey || "").includes("document")
        ? SelectedKeyTypes.DOCUMENT
        : "";

    const getCurrentData = () => {
        if (currentData && entity) {
            return currentData.find((dataItem: any) => dataItem[entity + "Id"] === currentErr.id);
        }
        return undefined;
    };

    useEffect(() => {
        if (currentErr?.field) {
            if (entity) {
                actionMethodResultSync(
                    "USER",
                    `${entity}/${currentErr.id}`,
                    "get",
                    getRequestHeader(authContext.token)
                ).then((res) => setCurrentData(res));
            }
        }
    }, [currentErr, entity]);

    const onFinish = useCallback(
        (record: any) => {
            const recordWithDates = getObjectWithHandledDates(record);

            const reqMethod = currentErr.field ? "put" : "post";

            const sendRequest = (data: Object) => {
                actionMethodResultSync(
                    "USER",
                    entity,
                    reqMethod,
                    getRequestHeader(authContext.token),
                    data
                )
                    .then((res) => {
                        console.log(res);
                        message.success("Сохранено");
                        onChangeErrors(editingIndex, {
                            ...currentErr,
                            addText: res[entity.replace("Info", "") + "Type"]?.nameRu || ""
                        });
                        handleCancel();
                    })
                    .catch((err) => {
                        console.log(err);
                        message.error("Ошибка");
                        handleCancel();
                    });
            };

            if (reqMethod === "put") {
                const finalData = removeEmptyObjectProperties(
                    _.merge(getCurrentData(), recordWithDates)
                );
                sendRequest({ ...finalData, userId: usersId });
            } else {
                const finalData = removeEmptyObjectProperties(recordWithDates);
                sendRequest({ ...finalData, userId: usersId });
            }
        },
        [entity, currentErr]
    );

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Form
                name="extraValidationModal"
                validateMessages={validateMessages}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="directoryModal"
                form={form}
            >
                <Row align={"middle"} justify={"center"} gutter={[16, 16]}>
                    <Col xl={24} xs={24}>
                        {(currentDataLayout || []).map((dataItemLayout, index) => (
                            <WithFormItem
                                key={"_" + index + dataItemLayout.propertyName}
                                dataItemLayout={dataItemLayout}
                            >
                                {getFormItemContent(form, dataItemLayout, getCurrentData())}
                            </WithFormItem>
                        ))}
                    </Col>
                    <Col>
                        <Form.Item className={classes.okBtnFormItem}>
                            <Button customType={"regular"} htmlType="submit">
                                {okText}
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Button customType={"primary"} onClick={handleCancel}>
                            Отмена
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
export default memo(ExtraValidationModal);
