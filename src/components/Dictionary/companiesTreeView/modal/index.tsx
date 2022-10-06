import React from "react";
import { Modal, Form, Input, Checkbox, Button, Row, Col, Select } from 'antd'
import { ICompanyCreateViewModel, ICompanyViewModel, IFormItem } from "../../../../interfaces";
import { FormInstance } from "antd/es/form/Form";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import FormItemLabel from "antd/es/form/FormItemLabel";

const { Option } = Select

export interface ICompanyDirectoryModal {
    okText: string;
    title: string;
    setIsVisible: (val: boolean) => void
    onFinish: (values: ICompanyCreateViewModel | ICompanyViewModel) => void;
    isVisible: boolean;
    form: FormInstance<ICompanyCreateViewModel | ICompanyViewModel>
}

const validateMessages = {
    required: "Обязательное поле!",
};

export const CompanyDirectoryModal = ({
    title,
    okText,
    onFinish,
    isVisible,
    setIsVisible,
    form
}: ICompanyDirectoryModal) => {

    const handleCancel = () => {
        setIsVisible(false)
    }

    return (
        <Modal
            title={title}
            open={isVisible}
            footer={null}
            onCancel={handleCancel}
        // okText={okText}
        >
            <Form<ICompanyCreateViewModel>
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
                <Row gutter={16} >
                    <Form.Item hidden name="companyId" />
                    <Form.Item hidden name="parentId" />
                    <Form.Item hidden name="createdAt" />

                    <Col xl={12} xs={24}>
                        <Form.Item
                            name="bin"
                            label="БИН"
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
                        <FormItemLabel prefixCls="" required={false} label="Адреса" />
                    </Col>
                    <Form.List name={["companyAddresses"]} >
                        {(fields, { add, remove }) => (
                            <>
                                {
                                    fields.map(({ name, key, ...restField }) => {
                                        return (
                                            <React.Fragment key={key} >
                                                <Form.Item hidden name="companyAddressId" />
                                                <Form.Item hidden name="companyId" />
                                                <Col xl={10} xs={24}>
                                                    <Form.Item
                                                        label='Адрес'
                                                        name={[name, "address"]}
                                                        rules={[{ required: true }]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col xl={10} xs={24}>
                                                    <Form.Item
                                                        label='Тип'
                                                        name={[name, "type"]}
                                                        rules={[{ required: true }]}
                                                    >
                                                        <Select
                                                            placeholder="Выберите тип"
                                                            allowClear
                                                        >
                                                            <Option value="FACT">фактический</Option>
                                                            <Option value="JUR">юридический</Option>
                                                            <Option value="OTHER">другой</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col xl={4} xs={24}>
                                                    <Button onClick={() => remove(name)} size="small" className="redCircleBtn" shape="circle" icon={<MinusOutlined color="#fff" />} />
                                                </Col>
                                            </React.Fragment>
                                        )
                                    })
                                }
                                <Col xl={24} xs={24}>
                                    <Button onClick={() => add({ type: "", address: "" })} size="small" className="greenCircleBtn" shape="circle" icon={<PlusOutlined color="#fff" />} />
                                </Col>
                            </>
                        )}
                    </Form.List>
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