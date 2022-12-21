import React, { FC, memo } from "react";
import { TLayoutModalData } from "data/types";
import { layoutConstantTypes } from "data/enums";
import { Form, FormInstance, Typography } from "antd";
import Select from "./Selects/Select";
import Input from "./Input";
import DatePicker from "./DatePicker";
import MultipleSelect from "./Selects/MultipleSelect";
import DivisionSelect from "./Selects/DivisionSelect";
import PositionSelect from "./Selects/PositionSelect";
import Checkbox from "./Checkbox";

const { Text } = Typography;

export const getFormItemContent = (
    form: FormInstance,
    dataItemLayout: TLayoutModalData,
    dataItemInfo: any,
    additionalModalFlag?: boolean
) => {
    return (
        <>
            {dataItemLayout.type === layoutConstantTypes.SELECT ? (
                <Select
                    form={form}
                    dataItemLayout={dataItemLayout}
                    currentDataItemInfo={dataItemInfo}
                    additionalModalFlag={additionalModalFlag}
                />
            ) : dataItemLayout.type === layoutConstantTypes.INPUT ||
              dataItemLayout.type === layoutConstantTypes.TEXTAREA ? (
                <Input
                    form={form}
                    dataItemLayout={dataItemLayout}
                    currentDataItemInfo={dataItemInfo}
                />
            ) : dataItemLayout.type === layoutConstantTypes.DATE ? (
                <DatePicker
                    form={form}
                    dataItemLayout={dataItemLayout}
                    currentDataItemInfo={dataItemInfo}
                />
            ) : dataItemLayout.type === layoutConstantTypes.TITLE ? (
                <Text strong style={{ fontSize: "18px" }}>
                    {dataItemLayout.placeholder}
                </Text>
            ) : dataItemLayout.type === layoutConstantTypes.CHECKBOX ? (
                <Checkbox
                    // form={form}
                    dataItemLayout={dataItemLayout}
                    // currentDataItemInfo={dataItemInfo}
                />
            ) : dataItemLayout.type === layoutConstantTypes.MULTIPLE_SELECT ? (
                <MultipleSelect
                    form={form}
                    dataItemLayout={dataItemLayout}
                    currentDataItemInfo={dataItemInfo}
                    additionalModalFlag={additionalModalFlag}
                />
            ) : dataItemLayout.type === layoutConstantTypes.DIVISION_SELECT ? (
                <DivisionSelect
                    form={form}
                    dataItemLayout={dataItemLayout}
                    currentDataItemInfo={dataItemInfo}
                    additionalModalFlag={additionalModalFlag}
                />
            ) : dataItemLayout.type === layoutConstantTypes.POSITION_SELECT ? (
                <PositionSelect
                    form={form}
                    dataItemLayout={dataItemLayout}
                    currentDataItemInfo={dataItemInfo}
                    additionalModalFlag={additionalModalFlag}
                />
            ) : null}
        </>
    );
};

const WithFormItem: FC<{ dataItemLayout: TLayoutModalData; children: any }> = ({
    dataItemLayout,
    children
}) => {
    const formItemRules: Array<{}> =
        dataItemLayout.pattern && dataItemLayout.patternMessage
            ? [
                  { required: dataItemLayout.required },
                  { pattern: dataItemLayout.pattern, message: dataItemLayout.patternMessage }
              ]
            : [{ required: dataItemLayout.required }];

    return dataItemLayout.type !== layoutConstantTypes.CHECKBOX ? (
        <Form.Item
            key={dataItemLayout.propertyName}
            name={dataItemLayout.propertyName}
            rules={formItemRules}
        >
            {children}
        </Form.Item>
    ) : (
        <Form.Item
            key={dataItemLayout.propertyName}
            initialValue={false}
            name={dataItemLayout.propertyName}
            valuePropName="checked"
            rules={formItemRules}
        >
            {children}
        </Form.Item>
    );
};

export default memo(WithFormItem);
