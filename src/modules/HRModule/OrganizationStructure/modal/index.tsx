import React, { memo, useEffect, useState } from "react";
import { Checkbox, Col, Form, Input, Modal, Row, Select, Tabs } from "antd";
import Button from "ui/Button";
import { FormInstance } from "antd/es/form/Form";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import FormItemLabel from "antd/es/form/FormItemLabel";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { validateMessages } from "data/constants";
import { IOrgStructureTreeItemViewModel, IPositionViewModel } from "interfaces";
import {
    BIN,
    COMPANY_ADDRESSES,
    COMPANY_TYPE,
    editingOptions,
    EMAIL,
    IS_COMPANY_HEAD,
    IS_COUNTERPARTY,
    IS_DIVISION_HEAD,
    layoutOptions,
    POSITION,
    structureLayout,
    TLayoutOptions
} from "../constants";
import CompanySelect from "modules/HRModule/Dictionary/companiesTreeView/modal/Select";
import { mailMessage, mailPattern } from "data/patterns";
import { inputLengthHandler } from "utils/inputLengthHandler";
import ModalBtns from "components/ModalRenderer/modalBtns";

const { Option } = Select;

export interface ISharedModal {
    okText: string;
    title: string;
    setIsVisible: (val: boolean) => void;
    onFinish: (values: any) => void;
    selectedTreeEntity: {
        treeItem: IOrgStructureTreeItemViewModel;
        layoutOption: TLayoutOptions;
    };
    existingData?: any;
    isVisible: boolean;
    form: FormInstance;
    positions: IPositionViewModel[];
}

const SharedModal = ({
    title,
    okText,
    onFinish,
    selectedTreeEntity,
    existingData,
    isVisible,
    setIsVisible,
    form,
    positions
}: ISharedModal) => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const handleCancel = () => {
        setIsVisible(false);
    };

    const { layoutOption } = selectedTreeEntity;
    const [activeKey, setActiveKey] = useState("1");

    const currentStructure = structureLayout[selectedTreeEntity.treeItem?.nodeType];
    const currentStructureLayout = currentStructure?.[layoutOption];

    useEffect(() => {
        if (existingData && editingOptions.includes(layoutOption)) {
            form.setFieldsValue({
                ...existingData,
                "position.positionId": existingData?.position?.positionId
            });
        }
    }, [existingData]);

    const colSpan = layoutOption === layoutOptions.EDIT_COMPANY ? 24 : 12;

    const WithForm = ({ children }: { children: any }) => {
        return (
            <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
                <Form
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
                    {children}
                    <ModalBtns okText={okText} onCancel={handleCancel} />
                </Form>
            </Modal>
        );
    };

    const formContent = (
        <Row
            align={"middle"}
            justify={layoutOption === layoutOptions.EDIT_COMPANY ? undefined : "center"}
            gutter={[16, layoutOption === layoutOptions.EDIT_COMPANY ? 0 : 16]}
        >
            {(currentStructureLayout || []).map(({ name, label, placeholder, required }) => (
                <React.Fragment key={name}>
                    {name === BIN ? (
                        <Col span={colSpan}>
                            <Form.Item
                                name={name}
                                label={label}
                                rules={[
                                    { required },
                                    {
                                        pattern: new RegExp(/^\d{12}$/),
                                        message: "Введите 12 цифр"
                                    }
                                ]}
                            >
                                <Input
                                    placeholder={placeholder}
                                    type="number"
                                    onKeyPress={inputLengthHandler}
                                    maxLength={12}
                                />
                            </Form.Item>
                        </Col>
                    ) : name === POSITION ? (
                        <Col span={colSpan}>
                            <Form.Item
                                name="position.positionId"
                                label="Должность"
                                rules={[{ required }]}
                            >
                                <Select showSearch={true} optionFilterProp={"children"} allowClear>
                                    {positions.map((el: any, i: number) => (
                                        <Option
                                            key={i}
                                            children={el.nameRu}
                                            value={el.positionId}
                                        />
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    ) : name === COMPANY_TYPE ? (
                        <Col span={colSpan}>
                            <Form.Item
                                name={name}
                                initialValue={existingData?.companyType}
                                rules={[{ required: true }]}
                            >
                                <CompanySelect
                                    form={form}
                                    defaultValue={existingData?.companyType?.companyTypeId}
                                    placeholder={"Тип компании"}
                                    fieldName={"companyType"}
                                    url={"company-type"}
                                    idKey={"companyTypeId"}
                                />
                            </Form.Item>
                        </Col>
                    ) : name === IS_COMPANY_HEAD || name === IS_DIVISION_HEAD ? (
                        <Col span={24}>
                            <Form.Item
                                initialValue={false}
                                name={name}
                                valuePropName="checked"
                                rules={[{ required }]}
                            >
                                <Checkbox defaultChecked={false}>{label}</Checkbox>
                            </Form.Item>
                        </Col>
                    ) : name === IS_COUNTERPARTY ? (
                        <Col span={colSpan}>
                            <Form.Item
                                initialValue={false}
                                name={name}
                                valuePropName="checked"
                                rules={[{ required }]}
                            >
                                <Checkbox defaultChecked={false}>{label}</Checkbox>
                            </Form.Item>
                        </Col>
                    ) : name === EMAIL ? (
                        <Col span={colSpan}>
                            <Form.Item
                                name={name}
                                rules={[
                                    { pattern: mailPattern, message: mailMessage },
                                    { required }
                                ]}
                            >
                                <Input placeholder={placeholder} />
                            </Form.Item>
                        </Col>
                    ) : name === COMPANY_ADDRESSES ? (
                        <>
                            <Col className={classes.addressLabel} span={24}>
                                <FormItemLabel prefixCls="" required={false} label="Адреса" />
                            </Col>
                            <Form.List name={[COMPANY_ADDRESSES]}>
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
                                                                existingData?.companyAddresses?.[
                                                                    name
                                                                ]?.country
                                                            }
                                                        >
                                                            <CompanySelect
                                                                form={form}
                                                                defaultValue={
                                                                    existingData
                                                                        ?.companyAddresses?.[name]
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
                                                                existingData?.companyAddresses?.[
                                                                    name
                                                                ]?.city
                                                            }
                                                        >
                                                            <CompanySelect
                                                                form={form}
                                                                defaultValue={
                                                                    existingData
                                                                        ?.companyAddresses?.[name]
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
                                                            <Select
                                                                placeholder="Тип адреса"
                                                                allowClear
                                                            >
                                                                <Option value="FACT">
                                                                    фактический
                                                                </Option>
                                                                <Option value="JUR">
                                                                    юридический
                                                                </Option>
                                                                <Option value="OTHER">
                                                                    другой
                                                                </Option>
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
                                                icon={
                                                    <PlusOutlined className={classes.plusBtnIcon} />
                                                }
                                            />
                                        </Col>
                                    </>
                                )}
                            </Form.List>
                        </>
                    ) : (
                        <Col span={colSpan}>
                            <Form.Item name={name} label={label} rules={[{ required }]}>
                                <Input placeholder={placeholder} />
                            </Form.Item>
                        </Col>
                    )}
                </React.Fragment>
            ))}
        </Row>
    );

    const divisionUnitAddition = (
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
                <Form.Item className={classes.rightFormItem} name="nameEn" label="На английском">
                    <Input />
                </Form.Item>
            </Col>
        </Row>
    );

    if (layoutOption === layoutOptions.ADD_DIVISION_UNIT) {
        return (
            <WithForm
                children={
                    <Tabs
                        className={classes.tabs}
                        activeKey={activeKey}
                        onChange={(key) => setActiveKey(key)}
                        items={[
                            {
                                label: "Текущие должности",
                                key: "1",
                                children: activeKey === "1" ? formContent : <></>
                            },
                            {
                                label: "Новая должность",
                                key: "2",
                                children: activeKey === "2" ? divisionUnitAddition : <></>
                            }
                        ]}
                    />
                }
            />
        );
    }

    return <WithForm children={formContent} />;
};

export default memo(SharedModal);
