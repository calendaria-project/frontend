import { Col, Form, FormInstance, Modal, Row } from "antd";

import React, { FC, memo, useCallback } from "react";

import { validateMessages } from "data/constants";

import WithFormItem, { getFormItemContent } from "components/Shared/ModalRenderer";
import _ from "lodash";
import ModalBtns from "components/Shared/ModalRenderer/modalBtns";
import { modalLayout } from "./modalLayout";

interface IExtraValidationModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    form: FormInstance;

    onFinish: (data: any) => void;
}

const ExtraValidationModal: FC<IExtraValidationModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    form,
    onFinish
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

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
                        {modalLayout.map((dataItemLayout, index) => (
                            <WithFormItem
                                key={"_" + index + dataItemLayout.propertyName}
                                dataItemLayout={dataItemLayout}
                            >
                                {getFormItemContent(form, dataItemLayout, undefined)}
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
