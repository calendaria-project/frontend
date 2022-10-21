import { Button, Col, Form, FormInstance, Modal, Row } from "antd";
import Select from "../Select";

import Input from "../Input";
import React, { FC, memo, useCallback } from "react";

import { validateMessages } from "data/validateMessages";
import { Types, TInputData } from "../../constants";

import "../../styles.scss";
import DatePicker from "../DatePicker";

interface IUserItemModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    onFinish: (values: Object) => void;
    form: FormInstance;
    currentDataLayout: Array<TInputData>;
}

const UserExtraCardAdditionalModal: FC<IUserItemModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    onFinish,
    form,
    currentDataLayout
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Form
                name="basic"
                validateMessages={validateMessages}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="directoryModal"
                form={form}
            >
                <Row gutter={16}>
                    <Col xl={24} xs={24}>
                        {(currentDataLayout || []).map((dataItemLayout) => (
                            <Form.Item
                                key={dataItemLayout.propertyName}
                                name={dataItemLayout.propertyName}
                                rules={[{ required: dataItemLayout.required }]}
                            >
                                {dataItemLayout.type === Types.SELECT ? (
                                    <Select
                                        form={form}
                                        dataItemLayout={dataItemLayout}
                                        currentDataItemInfo={undefined}
                                    />
                                ) : dataItemLayout.type === Types.INPUT ? (
                                    <Input
                                        dataItemLayout={dataItemLayout}
                                        currentDataItemInfo={undefined}
                                        form={form}
                                    />
                                ) : dataItemLayout.type === Types.DATE ? (
                                    <DatePicker
                                        form={form}
                                        dataItemLayout={dataItemLayout}
                                        currentDataItemInfo={undefined}
                                    />
                                ) : null}
                            </Form.Item>
                        ))}
                    </Col>
                    <Col xl={24} xs={24}>
                        <Form.Item>
                            <Button className="ok-btn" type="primary" htmlType="submit">
                                {okText}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
export default memo(UserExtraCardAdditionalModal);
