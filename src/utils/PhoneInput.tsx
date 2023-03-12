import { ChangeEvent, FC, KeyboardEvent, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Input, Tooltip } from "antd";
import getValueWithoutReplacedSymbols from "utils/getValueWithoutReplacedSymbols";

interface IPhoneInput {
    form: FormInstance;
    placeholder?: string;
    initialValue?: string;
}

const PhoneInput: FC<IPhoneInput> = ({ form, placeholder, initialValue }) => {
    const [currentValue, setCurrentValue] = useState("");

    useEffect(() => {
        if (initialValue) {
            setCurrentValue(initialValue);
        }
    }, [initialValue]);

    const handleChangeValue = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const pureValue = getValueWithoutReplacedSymbols(e.target.value, [
                "+",
                "(",
                ")",
                "-",
                "-"
            ]);
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
        },
        [form]
    );

    const handleAutoCompleteValue = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.code !== "Backspace") {
                if (currentValue.length === 6) {
                    setCurrentValue(currentValue + ")");
                }
                if (currentValue.length === 10 || currentValue.length === 13) {
                    setCurrentValue(currentValue + "-");
                }
            }
        },
        [currentValue]
    );

    return (
        <Tooltip placement={"left"} title={"Введите номер в формате +7(xxx)xxx-xx-xx"}>
            <Input
                maxLength={16}
                placeholder={placeholder}
                value={currentValue}
                onChange={handleChangeValue}
                onKeyDown={handleAutoCompleteValue}
            />
        </Tooltip>
    );
};
export default memo(PhoneInput);
