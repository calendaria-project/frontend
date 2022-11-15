import React, { useState, useEffect } from "react";
import { Col, Form, Input, Modal, Row, Select, Tabs } from "antd";
import Button from "ui/Button";
import { FormInstance } from "antd/es/form/Form";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import FormItemLabel from "antd/es/form/FormItemLabel";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { validateMessages } from "data/validateMessages";
import { IOrgStructureTreeItem, IPositionViewModel } from "interfaces";
import { editingOptions, layoutOptions, structureLayout, TLayoutOptions } from "../contants";

const { Option } = Select;

export interface ISharedModal {
    okText: string;
    title: string;
    setIsVisible: (val: boolean) => void;
    onFinish: (values: any) => void;
    selectedTreeEntity: {
        treeItem: IOrgStructureTreeItem;
        layoutOption: TLayoutOptions;
    };
    existingData?: any;
    isVisible: boolean;
    form: FormInstance;
    positions: Array<IPositionViewModel>;
}

export const SharedModal = ({
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
        if (existingData && editingOptions.includes(layoutOption))
            form.setFieldsValue({
                ...existingData,
                "position.positionId": existingData?.position?.positionId
            });
    }, [existingData]);

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
                    className={classes.directoryModal}
                >
                    {children}
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

    const formContent = (
        <Row align={"middle"} justify={"center"} gutter={[16, 16]}>
            {(currentStructureLayout || []).map(({ name, label, required }) => (
                <React.Fragment key={name}>
                    {name === "bin" ? (
                        <Col span={12}>
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
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                    ) : name === "position" ? (
                        <Col span={12}>
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
                    ) : name === "companyAddresses" ? (
                        <>
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
                                                            <Select
                                                                placeholder="Выберите тип"
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
                        <Col span={12}>
                            <Form.Item name={name} label={label} rules={[{ required }]}>
                                <Input />
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
