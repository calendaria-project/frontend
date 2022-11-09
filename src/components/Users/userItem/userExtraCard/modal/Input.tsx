import React, { FC, useState, useEffect, ChangeEvent, useCallback, KeyboardEvent } from "react";
import { FormInstance, Input as AntdInput } from "antd";
import { Types, TInputData } from "../constants";

interface IInput {
    form: FormInstance;
    dataItemLayout: TInputData;
    currentDataItemInfo: any;
}

const { TextArea } = AntdInput;

const Input: FC<IInput> = ({ form, dataItemLayout, currentDataItemInfo }) => {
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

            form.setFieldsValue({
                [dataItemLayout.propertyName]: newValue
            });
            setCurrentValue(newValue);
        },
        [dataItemLayout]
    );

    const handleAutoCompleteValue = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (dataItemLayout.customType && dataItemLayout.customType === "mobile") {
                if (currentValue.length === 0) {
                    setCurrentValue(`+${currentValue}`);
                }
                if (currentValue.length === 2) {
                    setCurrentValue(currentValue + "(");
                }
                if (currentValue.length === 6) {
                    setCurrentValue(currentValue + ")");
                }
                if (currentValue.length === 10 || currentValue.length === 13) {
                    setCurrentValue(currentValue + "-");
                }
            }
        },
        [dataItemLayout, currentValue]
    );

    if (dataItemLayout.type === Types.INPUT) {
        return (
            <AntdInput
                type={dataItemLayout.inputType}
                placeholder={dataItemLayout.placeholder}
                onChange={handleChangeValue}
                onKeyUp={handleAutoCompleteValue}
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
