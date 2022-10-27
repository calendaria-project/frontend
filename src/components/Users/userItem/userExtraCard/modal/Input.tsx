import React, { FC, useState, useEffect, ChangeEvent, useCallback } from "react";
import { FormInstance, Input as AntdInput } from "antd";
import { Types, TInputData } from "../constants";

interface IInput {
    form: FormInstance;
    dataItemLayout: TInputData;
    currentDataItemInfo: any;
}

const { TextArea } = AntdInput;

const Input: FC<IInput> = ({ form, dataItemLayout, currentDataItemInfo }) => {
    console.log("Input", currentDataItemInfo);

    const [currentValue, setCurrentValue] = useState<string>(
        currentDataItemInfo?.[dataItemLayout.propertyName]
    );

    useEffect(() => {
        setCurrentValue(currentDataItemInfo?.[dataItemLayout.propertyName]);
    }, [currentDataItemInfo, dataItemLayout]);

    useEffect(() => {
        form.setFieldsValue({
            [dataItemLayout.propertyName]: currentValue
        });
    }, [currentValue]);

    const handleChangeValue = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            let newValue = e.target.value;
            if (dataItemLayout.inputType === "email" && dataItemLayout.pattern) {
                if (
                    newValue.length > 2 &&
                    newValue[newValue.length - 2] === "." &&
                    newValue[newValue.length - 1] === "."
                ) {
                    newValue = newValue.substring(0, newValue.length - 1);
                }
            }

            form.setFieldsValue({
                [dataItemLayout.propertyName]: newValue
            });
            setCurrentValue(newValue);
        },
        [dataItemLayout]
    );

    if (dataItemLayout.type === Types.INPUT) {
        return (
            <AntdInput
                type={dataItemLayout.inputType}
                placeholder={dataItemLayout.placeholder}
                title={dataItemLayout.title}
                pattern={dataItemLayout.pattern}
                onChange={handleChangeValue}
                value={currentValue}
            />
        );
    }

    return (
        <TextArea
            placeholder={dataItemLayout.placeholder}
            onChange={handleChangeValue}
            value={currentValue}
        />
    );
};
export default Input;
