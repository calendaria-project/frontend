import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { IPositionViewModel, IStaffingItemCreateModel, IStaffingItemViewModel } from "interfaces";

const { Option } = Select;

export interface ICompanyDirectoryModal {
    okText: string;
    title: string;
    setIsVisible: (val: boolean) => void;
    onFinish: (values: IStaffingItemCreateModel | IStaffingItemViewModel) => void;
    isVisible: boolean;
    form: FormInstance<IStaffingItemCreateModel | IStaffingItemViewModel>;
    positions: IPositionViewModel[]
}

const validateMessages = {
    required: "Обязательное поле!"
};

export const StaffingItemModal = ({
    title,
    okText,
    onFinish,
    isVisible,
    setIsVisible,
    form,
    positions
}: ICompanyDirectoryModal) => {
    const handleCancel = () => {
        setIsVisible(false);
    };

    return (
        <Modal
            title={title}
            open={isVisible}
            footer={null}
            onCancel={handleCancel}
        // okText={okText}
        >
            <Form<IStaffingItemViewModel | IStaffingItemCreateModel>
                form={form}
                validateMessages={validateMessages}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="directoryModal"
            >
                <Row gutter={16}>
                    <Form.Item hidden name="staffingItemId" />
                    <Form.Item hidden name="staffingId" />
                    <Form.Item hidden name="divisionId" />
                    <Form.Item hidden name="createdAt" />
                    <Col xl={12} xs={24}>
                        <Form.Item name="positionId" label="Должность" rules={[{ required: true }]}>
                            <Select>
                                {positions.map((el, i) => (
                                    <Option key={i} value={el.positionId}>
                                        {el.nameRu}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xl={12} xs={24}>
                        <Form.Item name="staffUnitCount" label="Кол-во единиц" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col xl={12} xs={24}>
                        <Form.Item name="salary" label="Оклад" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col xl={12} xs={24}>
                        <Form.Item name="salarySupplement" label="Надбавка к окладу" rules={[{ required: true }]}>
                            <Input type="number"/>
                        </Form.Item>
                    </Col>
                    <Col xl={24} xs={24}>
                        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
                            <Button type="primary" htmlType="submit">
                                {okText}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
