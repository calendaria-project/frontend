import { Modal, Form, Input, Row, Col } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { validateMessages } from "data/constants";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import React from "react";
import ModalBtns from "components/ModalRenderer/modalBtns";

export interface ISharedModal {
    okText: string;
    title: string;
    setIsVisible: (val: boolean) => void;
    onFinish: (values: any) => void;
    isVisible: boolean;
    form: FormInstance;
}

const SharedModal = ({ title, okText, onFinish, isVisible, setIsVisible, form }: ISharedModal) => {
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
                name="basicDictionaryModal"
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
                            label="На Казахском"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            className={classes.leftFormItem}
                            name="nameRu"
                            label="На русском"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            className={classes.rightFormItem}
                            name="nameEn"
                            label="На английском"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <ModalBtns okText={okText} onCancel={handleCancel} />
            </Form>
        </Modal>
    );
};

export default SharedModal;
