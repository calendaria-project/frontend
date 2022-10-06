import { Modal, Form, Input, Button, Row, Col } from 'antd'
import { IPositionViewModel } from "interfaces";
import { FormInstance } from "antd/es/form/Form";

export interface IPositionDirectoryModal {
    okText: string;
    title: string;
    setIsVisible: (val: boolean) => void
    onFinish: (values: IPositionViewModel) => void;
    isVisible: boolean;
    form: FormInstance<IPositionViewModel>
}

const validateMessages = {
    required: "Обязательное поле!",
};

export const PositionDirectoryModal = ({
    title,
    okText,
    onFinish,
    isVisible,
    setIsVisible,
    form
}: IPositionDirectoryModal) => {

    const handleCancel = () => {
        setIsVisible(false)
    }

    return (
        <Modal
            title={title}
            open={isVisible}
            footer={null}
            onCancel={handleCancel}
        >
            <Form<IPositionViewModel>
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
                <Row gutter={16} >
                    <Col xl={12} xs={24}>
                        <Form.Item
                            name="code"
                            label="Код"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xl={12} xs={24}>
                        <Form.Item
                            name="nameKz"
                            label="На Казахском"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xl={12} xs={24}>
                        <Form.Item
                            name="nameRu"
                            label="На русском"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xl={12} xs={24}>
                        <Form.Item
                            name="nameEn"
                            label="На английском"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xl={24} xs={24}>
                        <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" htmlType="submit">
                                {okText}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form >
        </Modal >
    )
}