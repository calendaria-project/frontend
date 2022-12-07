import React from "react";
import { Modal, Form, Input, Row, Col, Select, Checkbox } from "antd";
import Button from "ui/Button";
import { ICompanyCreateViewModel, ICompanyViewModel } from "interfaces";
import { FormInstance } from "antd/es/form/Form";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import FormItemLabel from "antd/es/form/FormItemLabel";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";

import CompanySelect from "./Select";
import { mailMessage, mailPattern } from "utils/patterns";
import { inputLengthHandler } from "utils/inputLengthHandler";
import ModalBtns from "components/Shared/modalRenderer/modalBtns";

const { Option } = Select;

export interface ICompanyDirectoryModal {
    okText: string;
    title: string;
    setIsVisible: (val: boolean) => void;
    onFinish: (values: ICompanyCreateViewModel | ICompanyViewModel) => void;
    isVisible: boolean;
    form: FormInstance<ICompanyCreateViewModel | ICompanyViewModel>;
    companyData?: ICompanyViewModel;
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
    form,
    companyData
}: ICompanyDirectoryModal) => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const handleCancel = () => {
        setIsVisible(false);
    };

    console.log("company Data", companyData);

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
                className="directoryModal"
            >
                <Row gutter={[16, 0]}>
                    <Form.Item hidden name="companyId" />
                    <Form.Item hidden name="parentId" />
                    <Form.Item hidden name="createdAt" />

                    <Col span={24}>
                        <Form.Item
                            name="isCounterparty"
                            valuePropName="checked"
                            initialValue={false}
                            rules={[{ required: true }]}
                        >
                            <Checkbox defaultChecked={false}>Контрагент</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="bin"
                            rules={[
                                { required: true },
                                { pattern: new RegExp(/^\d{12}$/), message: "Введите 12 цифр" }
                            ]}
                        >
                            <Input
                                placeholder={"БИН"}
                                type="number"
                                onKeyPress={inputLengthHandler}
                                maxLength={12}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="nameKz" rules={[{ required: true }]}>
                            <Input placeholder={"На Казахском"} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="nameRu" rules={[{ required: true }]}>
                            <Input placeholder={"На русском"} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="nameEn">
                            <Input placeholder={"На английском"} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="companyType"
                            initialValue={companyData?.companyType}
                            rules={[{ required: true }]}
                        >
                            <CompanySelect
                                form={form}
                                defaultValue={companyData?.companyType?.companyTypeId}
                                placeholder={"Тип компании"}
                                fieldName={"companyType"}
                                url={"company-type"}
                                idKey={"companyTypeId"}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="companyIndex" rules={[{ required: true }]}>
                            <Input placeholder={"Индекс"} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="fax">
                            <Input placeholder={"Факс"} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="email"
                            rules={[
                                { pattern: mailPattern, message: mailMessage },
                                { required: true }
                            ]}
                        >
                            <Input placeholder={"Почта"} />
                        </Form.Item>
                    </Col>
                    <Col span={24} className={classes.addressLabel}>
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
                                                    name={[name, "country"]}
                                                    rules={[{ required: true }]}
                                                    initialValue={
                                                        companyData?.companyAddresses?.[name]
                                                            ?.country
                                                    }
                                                >
                                                    <CompanySelect
                                                        form={form}
                                                        defaultValue={
                                                            companyData?.companyAddresses?.[name]
                                                                ?.country?.id
                                                        }
                                                        placeholder={"Страна"}
                                                        fieldName={"country"}
                                                        url={"simple/COUNTRY"}
                                                        idKey={"id"}
                                                        num={name}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={11}>
                                                <Form.Item
                                                    className={classes.rightFormItem}
                                                    name={[name, "city"]}
                                                    rules={[{ required: true }]}
                                                    initialValue={
                                                        companyData?.companyAddresses?.[name]?.city
                                                    }
                                                >
                                                    <CompanySelect
                                                        form={form}
                                                        defaultValue={
                                                            companyData?.companyAddresses?.[name]
                                                                ?.city?.id
                                                        }
                                                        placeholder={"Город"}
                                                        fieldName={"city"}
                                                        url={"simple/CITY"}
                                                        idKey={"id"}
                                                        num={name}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={11}>
                                                <Form.Item
                                                    className={classes.leftFormItem}
                                                    name={[name, "address"]}
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input placeholder={"Адрес"} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={11}>
                                                <Form.Item
                                                    className={classes.rightFormItem}
                                                    name={[name, "type"]}
                                                    rules={[{ required: true }]}
                                                >
                                                    <Select placeholder="Тип адреса" allowClear>
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
                </Row>
                <ModalBtns okText={okText} onCancel={handleCancel} />
            </Form>
        </Modal>
    );
};
