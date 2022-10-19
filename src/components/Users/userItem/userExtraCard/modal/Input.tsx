import React, { FC, useState, useEffect, ChangeEvent, useCallback } from "react";
import { FormInstance, Input as AntdInput } from "antd";
import { TInputData } from "../constants";

interface IInput {
    form: FormInstance;
    dataItemLayout: TInputData;
    currentDataItemInfo: any;
}

const Input: FC<IInput> = ({ form, dataItemLayout, currentDataItemInfo }) => {
    const [currentValue, setCurrentValue] = useState<string>(
        currentDataItemInfo?.[dataItemLayout.propertyName] ??
            currentDataItemInfo?.[0]?.[dataItemLayout.propertyName]
    );
    const handleChangeValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        form.setFieldsValue({
            [dataItemLayout.propertyName]: e.target.value
        });
        setCurrentValue(e.target.value);
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            [dataItemLayout.propertyName]: currentValue
        });
    }, []);

    return (
        <AntdInput
            placeholder={dataItemLayout.placeholder}
            pattern={dataItemLayout.pattern}
            onChange={handleChangeValue}
            value={currentValue}
        />
    );
};
export default Input;
