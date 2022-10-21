import React, { FC, useState, useEffect, ChangeEvent, useCallback } from "react";
import { FormInstance, Input as AntdInput } from "antd";
import { TInputData } from "../constants";

interface IInput {
    form: FormInstance;
    dataItemLayout: TInputData;
    currentDataItemInfo: any;
}

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
        (e: ChangeEvent<HTMLInputElement>) => {
            form.setFieldsValue({
                [dataItemLayout.propertyName]: e.target.value
            });
            setCurrentValue(e.target.value);
        },
        [dataItemLayout]
    );

    return (
        <AntdInput
            placeholder={dataItemLayout.placeholder}
            onChange={handleChangeValue}
            value={currentValue}
        />
    );
};
export default Input;
