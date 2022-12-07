import { Col, Form, FormInstance, message, Modal, Row } from "antd";

import React, { FC, memo, useCallback, useContext, useEffect, useState } from "react";

import { validateMessages } from "data/validateMessages";

import { IErrorModifiedItem } from "data/errorCodes";
import { modalData } from "../../../constants";
import { selectedKeyTypes } from "data/enums";
import { TLayoutModalData } from "data/types";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { AuthContext } from "context/AuthContextProvider";
import WithFormItem, { getFormItemContent } from "components/Shared/modalRenderer";
import getObjectWithHandledDates from "utils/getObjectWithHandeledDates";
import _ from "lodash";
import { removeEmptyObjectProperties } from "utils/removeObjectProperties";
import { getModalEditingNameByKey } from "utils/getModalEditingNameByKey";
import ModalBtns from "components/Shared/modalRenderer/modalBtns";

interface IExtraValidationModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    form: FormInstance;
    currentErr: IErrorModifiedItem;
    onChangeError: (currentErr: IErrorModifiedItem) => void;
    usersId: string;
}

const ExtraValidationModal: FC<IExtraValidationModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    form,
    onChangeError,
    currentErr,
    usersId
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const authContext = useContext(AuthContext);

    const currentDataLayout: TLayoutModalData[] = modalData[currentErr?.selectedKey];
    const [entityArrData, setEntityArrData] = useState<any>(undefined);

    const entity = (currentErr?.selectedKey || "").includes("address")
        ? selectedKeyTypes.ADDRESS_INFO
        : (currentErr?.selectedKey || "").includes("document")
        ? selectedKeyTypes.DOCUMENT
        : "";

    const getExactEntityData = () => {
        if (entityArrData && entity) {
            return entityArrData.find((dataItem: any) => dataItem[entity + "Id"] === currentErr.id);
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
                ).then((res) => setEntityArrData(res));
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
                        onChangeError({
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

            if (entity) {
                if (reqMethod === "put") {
                    const finalData = removeEmptyObjectProperties(
                        _.merge(getExactEntityData(), recordWithDates)
                    );
                    sendRequest({ ...finalData, userId: usersId });
                } else {
                    const finalData = removeEmptyObjectProperties(recordWithDates);
                    sendRequest({ ...finalData, userId: usersId });
                }
            }
        },
        [entity, currentErr]
    );

    return (
        <Modal
            title={title + getModalEditingNameByKey(entity)}
            open={isVisible}
            footer={null}
            onCancel={handleCancel}
        >
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
                                {getFormItemContent(form, dataItemLayout, getExactEntityData())}
                            </WithFormItem>
                        ))}
                    </Col>
                </Row>
                <ModalBtns okText={okText} onCancel={handleCancel} />
            </Form>
        </Modal>
    );
};
export default memo(ExtraValidationModal);
