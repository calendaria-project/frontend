import { Col, Form, FormInstance, Modal, Row, Typography } from "antd";
import Select from "../Select";

import Button from "ui/Button";

import Input from "../Input";
import React, { FC, memo, useCallback } from "react";

import { validateMessages } from "data/validateMessages";
import { Types, TInputData } from "../../constants";

import useStyles from "../styles";
import DatePicker from "../DatePicker";

const { Text } = Typography;

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

    const classes = useStyles();

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Form
                name="simpleAdditionalModal"
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
                        {(currentDataLayout || []).map((dataItemLayout, index) => (
                            <Form.Item
                                key={"" + dataItemLayout.propertyName + index}
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
                                ) : dataItemLayout.type === Types.TITLE ? (
                                    <Text strong className={classes.titleItem}>
                                        {dataItemLayout.placeholder}
                                    </Text>
                                ) : null}
                            </Form.Item>
                        ))}
                    </Col>
                </Row>
                <Row align={"middle"} justify={"center"} gutter={[16, 16]}>
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
export default memo(UserExtraCardAdditionalModal);
