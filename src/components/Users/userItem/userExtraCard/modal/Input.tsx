import React, { FC, useState, useEffect, ChangeEvent, useCallback, KeyboardEvent } from "react";
import { FormInstance, Input as AntdInput, Tooltip } from "antd";
import { Types, TInputData } from "../constants";
import getValueWithoutReplacedSymbols from "utils/getValueWithoutReplacedSymbols";

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

    const mobileInputFlag = dataItemLayout.customType && dataItemLayout.customType === "mobile";

    const handleChangeValue = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const setNewValue = (newValue: string) => {
                form.setFieldsValue({
                    [dataItemLayout.propertyName]: newValue
                });
                setCurrentValue(newValue);
            };

            if (!mobileInputFlag) {
                setNewValue(e.target.value);
            } else {
                const pureValue = getValueWithoutReplacedSymbols(e.target.value, [
                    "+",
                    "(",
                    ")",
                    "-",
                    "-"
                ]);
                console.log(pureValue);
                if (/^\d+$/.test(pureValue || "") || pureValue === "") {
                    let newValue = e.target.value;
                    if (newValue[0] !== "+") {
                        newValue = `+${newValue}`;
                    }
                    if (newValue[1] !== "7") {
                        newValue = newValue.slice(0, 1) + "7" + newValue.slice(1);
                    }
                    if (newValue[2] !== "(") {
                        newValue = newValue.slice(0, 2) + "(" + newValue.slice(2);
                    }
                    form.setFieldsValue({
                        "personalContact.mobilePhoneNumber": newValue
                    });
                    setCurrentValue(newValue);
                }
            }
        },
        [dataItemLayout]
    );

    const handleAutoCompleteValue = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (mobileInputFlag && e.code !== "Backspace") {
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
        if (mobileInputFlag) {
            return (
                <Tooltip placement={"left"} title={"Введите номер в формате +7(xxx)xxx-xx-xx"}>
                    <AntdInput
                        maxLength={16}
                        placeholder={dataItemLayout.placeholder}
                        onChange={handleChangeValue}
                        onKeyDown={handleAutoCompleteValue}
                        value={currentValue}
                    />
                </Tooltip>
            );
        } else {
            return (
                <AntdInput
                    type={dataItemLayout.inputType}
                    placeholder={dataItemLayout.placeholder}
                    onChange={handleChangeValue}
                    value={currentValue}
                />
            );
        }
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
