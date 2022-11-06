import React from "react";
import { Modal, Form, Input, Row, Col, Select } from "antd";
import Button from "ui/Button";
import { ICompanyCreateViewModel, ICompanyViewModel } from "interfaces";
import { FormInstance } from "antd/es/form/Form";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import FormItemLabel from "antd/es/form/FormItemLabel";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";

const { Option } = Select;

export interface ICompanyDirectoryModal {
    okText: string;
    title: string;
    setIsVisible: (val: boolean) => void;
    onFinish: (values: ICompanyCreateViewModel | ICompanyViewModel) => void;
    isVisible: boolean;
    form: FormInstance<ICompanyCreateViewModel | ICompanyViewModel>;
}

const validateMessages = {
    required: "Обязательное поле!"
};

export const CompanyDirectoryModal = ({
    title,
    okText,
    onFinish,
    isVisible,
    setIsVisible,
    form
}: ICompanyDirectoryModal) => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const handleCancel = () => {
        setIsVisible(false);
    };

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
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
                className={classes.directoryModal}
            >
                <Row gutter={16} justify={"space-between"}>
                    <Form.Item hidden name="companyId" />
                    <Form.Item hidden name="parentId" />
                    <Form.Item hidden name="createdAt" />

                    <Col span={12}>
                        <Form.Item
                            className={classes.leftFormItem}
                            name="bin"
                            label="БИН"
                            rules={[
                                { required: true },
                                { pattern: new RegExp(/^\d{12}$/), message: "Введите 12 цифр" }
                            ]}
                        >
                            <Input type="number" />
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
                    <Col span={24}>
                        <FormItemLabel prefixCls="" required={false} label="Адреса" />
                    </Col>
                    <Form.List name={["companyAddresses"]}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ name, key, ...restField }) => {
                                    return (
                                        <React.Fragment key={key}>
                                            <Form.Item hidden name="companyAddressId" />
                                            <Form.Item hidden name="companyId" />
                                            <Col span={11}>
                                                <Form.Item
                                                    className={classes.leftFormItem}
                                                    label="Адрес"
                                                    name={[name, "address"]}
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={11}>
                                                <Form.Item
                                                    className={classes.rightFormItem}
                                                    label="Тип"
                                                    name={[name, "type"]}
                                                    rules={[{ required: true }]}
                                                >
                                                    <Select placeholder="Выберите тип" allowClear>
                                                        <Option value="FACT">фактический</Option>
                                                        <Option value="JUR">юридический</Option>
                                                        <Option value="OTHER">другой</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={2} className={classes.minusCol}>
                                                <Button
                                                    onClick={() => remove(name)}
                                                    size="small"
                                                    shape="circle"
                                                    icon={
                                                        <MinusOutlined
                                                            className={classes.minusBtnIcon}
                                                        />
                                                    }
                                                />
                                            </Col>
                                        </React.Fragment>
                                    );
                                })}
                                <Col span={24}>
                                    <Button
                                        className={classes.plusCol}
                                        onClick={() => add({ type: "", address: "" })}
                                        size="small"
                                        shape="circle"
                                        icon={<PlusOutlined className={classes.plusBtnIcon} />}
                                    />
                                </Col>
                            </>
                        )}
                    </Form.List>
                    <Col xl={24} xs={24}>
                        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
                            <Button customType="regular" htmlType="submit">
                                {okText}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
