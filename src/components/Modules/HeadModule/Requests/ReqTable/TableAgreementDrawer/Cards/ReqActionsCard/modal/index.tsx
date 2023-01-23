import { Col, FormInstance, Input, Modal, Row } from "antd";

import React, { FC, memo, useCallback } from "react";
import ModalBtns from "components/Shared/modalRenderer/modalBtns";
import { validateMessages } from "data/constants";
import { Form } from "antd";

interface ICancelReqModal {
    form: FormInstance;
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    onFinish: (data: { reason: string }) => void;
}

const CancelReqModal: FC<ICancelReqModal> = ({
    form,
    okText,
    title,
    isVisible,
    setIsVisible,
    onFinish
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Form
                form={form}
                name="cancelReqModal"
                validateMessages={validateMessages}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="directoryModal"
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            rules={[{ required: true, message: "Укажите причину" }]}
                            name={"reason"}
                        >
                            <Input placeholder={"Опишите здесь причину"} />
                        </Form.Item>
                    </Col>
                </Row>
                <ModalBtns okText={okText} onCancel={handleCancel} />
            </Form>
        </Modal>
    );
};

export default memo(CancelReqModal);
