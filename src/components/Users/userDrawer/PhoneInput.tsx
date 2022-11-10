import { ChangeEvent, FC, KeyboardEvent, memo, useCallback, useState } from "react";
import { FormInstance, Input } from "antd";
import getValueWithoutReplacedSymbols from "../../../utils/getValueWithoutReplacedSymbols";

interface IPhoneInput {
    form: FormInstance;
}

const PhoneInput: FC<IPhoneInput> = ({ form }) => {
    const [currentValue, setCurrentValue] = useState("");

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
        <Input
            maxLength={16}
            value={currentValue}
            onChange={handleChangeValue}
            onKeyDown={handleAutoCompleteValue}
        />
    );
};
export default memo(PhoneInput);
