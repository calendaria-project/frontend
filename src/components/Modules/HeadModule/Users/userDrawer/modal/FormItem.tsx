import { Checkbox, Form, FormInstance } from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";
import { ISimpleDictionaryViewModel } from "interfaces";
import { IAppItemAccessOptionalTypeViewModel } from "interfaces/extended";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { appItemTypeValues } from "../utils";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { dictionaryCodesEnum } from "data/enums";
import SharedEmptySelect from "components/Shared/modalRenderer/Selects/SharedEmptySelect";
import { getPlaceholderOfAppItemTypeValue } from "../utils";

interface IFormItem {
    form: FormInstance;
    currentDictionary: ISimpleDictionaryViewModel;
}

const FormItem: FC<IFormItem> = ({ form, currentDictionary }) => {
    const name = currentDictionary.code;
    const id = currentDictionary.id;
    const mobileFlag = name === appItemTypeValues.MOBILE;

    const [currentValue, setCurrentValue] = useState<boolean>(false);
    const [extraDictionaryValues, setExtraDictionaryValues] = useState<
        IAppItemAccessOptionalTypeViewModel[]
    >([]);

    const { getDictionaryValues } = useSimpleHttpFunctions();

    const handleChangeValue = useCallback(
        (e: CheckboxChangeEvent) => {
            setCurrentValue(e.target.checked);
        },
        [currentValue]
    );

    useEffect(() => {
        form.setFieldValue(name, currentValue);
    }, [currentValue]);

    useEffect(() => {
        if (currentValue) {
            initExtraValues();
        }
    }, [currentValue, id, name]);

    const initExtraValues = async () => {
        if (mobileFlag) {
            const values: ISimpleDictionaryViewModel[] = await getDictionaryValues(
                `simple/${dictionaryCodesEnum.MOBILE_TARIFF}`
            );
            setExtraDictionaryValues(values);
        } else {
            const values: IAppItemAccessOptionalTypeViewModel[] = await getDictionaryValues(
                `app-item-access-type?appItemTypeId=${id}`
            );
            setExtraDictionaryValues(values);
        }
    };

    return (
        <>
            <Form.Item
                initialValue={false}
                name={name}
                valuePropName="checked"
                style={{ marginTop: "14px" }}
            >
                <Checkbox value={currentValue} onChange={handleChangeValue}>
                    {currentDictionary.nameRu}
                </Checkbox>
            </Form.Item>
            {currentValue && extraDictionaryValues && extraDictionaryValues.length ? (
                <Form.Item
                    name={`item.${name}`}
                    rules={[{ required: true, message: "Выберите значение" }]}
                >
                    <SharedEmptySelect
                        form={form}
                        selectValues={extraDictionaryValues}
                        id={"id"}
                        propertyName={`item.${name}`}
                        placeholder={getPlaceholderOfAppItemTypeValue(name)}
                    />
                </Form.Item>
            ) : null}
        </>
    );
};
export default FormItem;
