import { Modal, Form, Input, Row, Col } from "antd";
import { validateMessages } from "data/constants";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import React from "react";

import { ISharedModal } from "../../../TableRenderer/SharedModal";
import ModalBtns from "components/ModalRenderer/modalBtns";

const CompanyTypeModal = ({
    title,
    okText,
    onFinish,
    isVisible,
    setIsVisible,
    form
}: ISharedModal) => {
    const handleCancel = () => {
        setIsVisible(false);
    };

    const theme = useTheme<ITheme>();
    //@ts-ignore
    const classes = useStyles(theme);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Form
                form={form}
                name="basic"
                validateMessages={validateMessages}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="directoryModal"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            className={classes.leftFormItem}
                            name="code"
                            label="Код"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            className={classes.rightFormItem}
                            name="nameKz"
                            label="Наименование Каз."
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            className={classes.leftFormItem}
                            name="nameRu"
                            label="Наименование Рус."
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            className={classes.rightFormItem}
                            name="nameEn"
                            label="Наименование Англ."
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="longnameKz"
                            label="Полное Каз. наименование"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="longnameRu"
                            label="Полное Рус. наименование"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="longnameEn" label="Полное Англ. наименование">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <ModalBtns okText={okText} onCancel={handleCancel} />
            </Form>
        </Modal>
    );
};

export default CompanyTypeModal;
