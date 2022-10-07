import { Modal, Form, DatePicker, Button, Row, Col } from 'antd'
import { FormInstance } from "antd/es/form/Form";

import { IStaffingModel } from "interfaces";

export interface IStaffingDirectoryModal {
    okText: string;
    title: string;
    setIsVisible: (val: boolean) => void
    onFinish: (values: IStaffingModel) => void;
    isVisible: boolean;
    form: FormInstance<IStaffingModel>
}

const validateMessages = {
    required: "Обязательное поле!",
};

export const StaffingScheduleModal = ({
    title,
    okText,
    onFinish,
    isVisible,
    setIsVisible,
    form
}: IStaffingDirectoryModal) => {

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
            <Form<IStaffingModel>
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
                            name="fromDate"
                            label="Дата действия с"
                            rules={[{ required: true }]}
                        >
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                    <Col xl={12} xs={24}>
                        <Form.Item
                            name="toDate"
                            label="Дата действия по"
                        >
                            <DatePicker format="DD/MM/YYYY" />
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