import { ChangeEvent, FC, KeyboardEvent, memo, useCallback, useState } from "react";
import { FormInstance, Input } from "antd";

interface IPhoneInput {
    form: FormInstance;
}

const PhoneInput: FC<IPhoneInput> = ({ form }) => {
    const [currentValue, setCurrentValue] = useState("");

    const handleChangeValue = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            let newValue = e.target.value;

            form.setFieldsValue({
                "personalContact.mobilePhoneNumber": newValue
            });
            setCurrentValue(newValue);
        },
        [form]
    );

    const handleAutoCompleteValue = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
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
        },
        [currentValue]
    );

    return (
        <Input
            value={currentValue}
            onChange={handleChangeValue}
            onKeyDown={handleAutoCompleteValue}
        />
    );
};
export default memo(PhoneInput);
