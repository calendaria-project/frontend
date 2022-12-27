import React, { FC, useCallback } from "react";
import { FormInstance } from "antd/es/form/Form";
import { Col, Form, Input, Modal, Row } from "antd";
import { validateMessages } from "data/constants";
import WithFormItem, { getFormItemContent } from "components/Shared/modalRenderer";
import ModalBtns from "components/Shared/modalRenderer/modalBtns";
import { ADD_REQUEST_LAYOUT } from "./defaultValues";

export interface AddRequestModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (val: boolean) => void;
    onFinish: (data: any) => void;
    form: FormInstance;
    userName: string;
}

const AddRequestModal: FC<AddRequestModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    onFinish,
    form,
    userName
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Form
                name="addRequestModal"
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
                        <Form.Item initialValue={userName} key={"userName"} name={"userName"}>
                            <Input disabled defaultValue={userName} />
                        </Form.Item>
                        {ADD_REQUEST_LAYOUT.map((dataItemLayout, index) => (
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
export default AddRequestModal;
