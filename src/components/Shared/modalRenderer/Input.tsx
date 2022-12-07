import React, {
    FC,
    useState,
    useEffect,
    ChangeEvent,
    useCallback,
    KeyboardEvent,
    memo
} from "react";
import { FormInstance, Input as AntdInput, Tooltip } from "antd";
import { TLayoutModalData } from "data/types";
import { layoutConstantTypes } from "data/enums";
import getValueWithoutReplacedSymbols from "utils/getValueWithoutReplacedSymbols";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { useTypedSelector } from "hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import { SetModalConstantSalary, SetModalVariableSalary } from "store/actions";
import {
    SALARY,
    SALARY_CONSTANT_PART,
    SALARY_CONSTANT_PERCENT,
    SALARY_VARIABLE_PART,
    SALARY_VARIABLE_PERCENT
} from "data/values";

interface IInput {
    form: FormInstance;
    dataItemLayout: TLayoutModalData;
    currentDataItemInfo: any;
}

const { TextArea } = AntdInput;

const Input: FC<IInput> = ({ form, dataItemLayout, currentDataItemInfo }) => {
    const dispatch = useDispatch();
    const [currentValue, setCurrentValue] = useState<string | number>("");

    const variableSalary = useTypedSelector((state) => state.modal.variableSalary) ?? 0;
    const constantSalary = useTypedSelector((state) => state.modal.constantSalary) ?? 0;

    const { calculatePercent } = useSimpleHttpFunctions();

    useEffect(() => {
        const initialValue = currentDataItemInfo?.[dataItemLayout.propertyName];
        setCurrentValue(initialValue);
        form.setFieldValue([dataItemLayout.propertyName], initialValue);
    }, []);

    useEffect(() => {
        if (!dataItemLayout.propertyName.includes(SALARY)) {
            form.setFieldValue([dataItemLayout.propertyName], currentValue);
        }
    }, [currentValue]);

    useEffect(() => {
        if (dataItemLayout.propertyName === SALARY_VARIABLE_PART) {
            const salary = form.getFieldValue(SALARY);
            const variablePercent = form.getFieldValue(SALARY_VARIABLE_PERCENT);
            if (salary && variablePercent) {
                setCurrentValue(variableSalary);
            }
        }
    }, [variableSalary]);

    useEffect(() => {
        if (dataItemLayout.propertyName === SALARY_CONSTANT_PART) {
            const salary = form.getFieldValue(SALARY);
            const constantPercent = form.getFieldValue(SALARY_CONSTANT_PERCENT);
            if (salary && constantPercent) {
                setCurrentValue(constantSalary);
            }
        }
    }, [constantSalary]);

    const mobileInputFlag = dataItemLayout.customType && dataItemLayout.customType === "mobile";

    const handleChangeValue = useCallback(
        async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (!mobileInputFlag) {
                const propertyName = dataItemLayout.propertyName;
                const newValue = e.target.value;

                if (propertyName.includes(SALARY)) {
                    const salary = form.getFieldValue(SALARY);
                    if (propertyName === SALARY_CONSTANT_PERCENT && salary) {
                        if (salary) {
                            const constantSalaryPart = await calculatePercent(+salary, +newValue);
                            dispatch(SetModalConstantSalary(+constantSalaryPart));
                        }
                    } else if (propertyName === SALARY_VARIABLE_PERCENT && salary) {
                        if (salary) {
                            const variableSalaryPart = await calculatePercent(+salary, +newValue);
                            dispatch(SetModalVariableSalary(+variableSalaryPart));
                        }
                    } else if (propertyName === SALARY) {
                        const constantPercent = form.getFieldValue(SALARY_CONSTANT_PERCENT);
                        const variablePercent = form.getFieldValue(SALARY_VARIABLE_PERCENT);
                        if (newValue) {
                            if (constantPercent) {
                                const constantSalaryPart = await calculatePercent(
                                    +newValue,
                                    constantPercent
                                );
                                dispatch(SetModalConstantSalary(+constantSalaryPart));
                            }
                            if (variablePercent) {
                                const variableSalaryPart = await calculatePercent(
                                    +newValue,
                                    variablePercent
                                );
                                dispatch(SetModalVariableSalary(+variableSalaryPart));
                            }
                        }
                    }

                    setCurrentValue(newValue);
                    form.setFieldValue([propertyName], +newValue);
                } else {
                    setCurrentValue(newValue);
                }
            } else {
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
                    form.setFieldValue("personalContact.mobilePhoneNumber", newValue);
                    setCurrentValue(newValue);
                }
            }
        },
        [dataItemLayout]
    );

    const handleAutoCompleteValue = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (mobileInputFlag && e.code !== "Backspace") {
                if ((currentValue + "").length === 6) {
                    setCurrentValue(currentValue + ")");
                }
                if ((currentValue + "").length === 10 || (currentValue + "").length === 13) {
                    setCurrentValue(currentValue + "-");
                }
            }
        },
        [dataItemLayout, currentValue]
    );

    if (dataItemLayout.type === layoutConstantTypes.INPUT) {
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
                    id={dataItemLayout.propertyName}
                    type={dataItemLayout.inputType}
                    disabled={dataItemLayout.disabled}
                    suffix={dataItemLayout.suffix}
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
export default memo(Input);
