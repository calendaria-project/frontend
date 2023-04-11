import { Checkbox, Form, FormInstance } from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";
import { IAccessApplicationStorageItemViewModel, ISimpleDictionaryViewModel } from "interfaces";
import { IAppItemAccessOptionalTypeViewModel } from "interfaces/extended";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { dictionaryCodesEnum, appItemTypeValues } from "data/enums";
import SharedEmptySelect from "components/ModalRenderer/selects/SharedEmptySelect";
import getPlaceholderOfAppItemTypeValue from "utils/getPlaceholderOfAppItemTypeValue";

interface IFormItem {
    form: FormInstance;
    currentDictionary: ISimpleDictionaryViewModel;
    selectedUserId?: string;
}

const FormItem: FC<IFormItem> = ({ form, currentDictionary, selectedUserId }) => {
    const name = currentDictionary.code;
    const id = currentDictionary.id;
    const mobileFlag = name === appItemTypeValues.MOBILE;

    const [currentValue, setCurrentValue] = useState<boolean>(false);
    const [extraDictionaryValue, setExtraDictionaryValue] = useState<number | undefined>(undefined);
    const [extraDictionaryValues, setExtraDictionaryValues] = useState<
        IAppItemAccessOptionalTypeViewModel[]
    >([]);

    const [accessStorageItems, setAccessStorageItems] = useState<
        IAccessApplicationStorageItemViewModel[]
    >([]);

    const foundedAccessStorageItem = accessStorageItems.find(
        (accessStItem) => accessStItem.appItemTypeId === id
    );
    const valueByFoundedStorageItem = foundedAccessStorageItem
        ? foundedAccessStorageItem.hasAccess
        : false;

    useEffect(() => {
        setCurrentValue(valueByFoundedStorageItem);
    }, [valueByFoundedStorageItem]);

    useEffect(() => {
        form.setFieldValue(name, currentValue);
    }, [currentValue]);

    const { getDictionaryValues, getAccessStorageItemsByUserId } = useSimpleHttpFunctions();

    useEffect(() => {
        initAccessStorageItems();
    }, [selectedUserId]);

    const initAccessStorageItems = () => {
        if (selectedUserId) {
            getAccessStorageItemsByUserId(selectedUserId).then((d) => setAccessStorageItems(d));
        }
    };

    //initExtraValue
    useEffect(() => {
        if (currentValue) {
            if (mobileFlag) {
                setExtraDictionaryValue(
                    foundedAccessStorageItem ? foundedAccessStorageItem.tariffId : undefined
                );
            } else {
                setExtraDictionaryValue(
                    foundedAccessStorageItem ? foundedAccessStorageItem.accessTypeId : undefined
                );
            }
        }
    }, [currentValue, mobileFlag, foundedAccessStorageItem]);

    useEffect(() => {
        if (currentValue) {
            initExtraValues();
        }
    }, [currentValue, id, mobileFlag]);

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

    const handleChangeValue = useCallback(
        (e: CheckboxChangeEvent) => {
            setCurrentValue(e.target.checked);
        },
        [currentValue]
    );

    return (
        <>
            <Form.Item
                initialValue={valueByFoundedStorageItem}
                name={name}
                valuePropName="checked"
                style={{ marginTop: "14px" }}
            >
                <Checkbox
                    disabled={valueByFoundedStorageItem}
                    value={currentValue}
                    onChange={handleChangeValue}
                >
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
                        initialValue={extraDictionaryValue}
                        id={"id"}
                        propertyName={`item.${name}`}
                        placeholder={getPlaceholderOfAppItemTypeValue(name)}
                        disabled={valueByFoundedStorageItem}
                    />
                </Form.Item>
            ) : null}
        </>
    );
};
export default FormItem;
