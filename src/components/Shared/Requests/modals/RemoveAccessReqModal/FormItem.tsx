import { Checkbox, Form, FormInstance } from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";
import { IAccessApplicationStorageItemViewModel, ISimpleDictionaryViewModel } from "interfaces";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";

interface IFormItem {
    form: FormInstance;
    currentDictionary: ISimpleDictionaryViewModel;
    selectedUserId?: string;
    disabledAllFlag?: boolean;
}

const FormItem: FC<IFormItem> = ({ form, currentDictionary, selectedUserId, disabledAllFlag }) => {
    const name = currentDictionary.code;
    const id = currentDictionary.id;

    const [currentValue, setCurrentValue] = useState<boolean>(false);

    const [accessStorageItems, setAccessStorageItems] = useState<
        IAccessApplicationStorageItemViewModel[]
    >([]);

    const foundedAccessStorageItem = accessStorageItems.find(
        (accessStItem) => accessStItem.appItemTypeId === id
    );

    const valueByFoundedStorageItem = !disabledAllFlag
        ? foundedAccessStorageItem
            ? !foundedAccessStorageItem.hasAccess
            : false
        : disabledAllFlag;

    const { getAccessStorageItemsByUserId } = useSimpleHttpFunctions();

    useEffect(() => {
        initAccessStorageItems();
    }, [selectedUserId]);

    const initAccessStorageItems = () => {
        if (selectedUserId) {
            getAccessStorageItemsByUserId(selectedUserId).then((d) => setAccessStorageItems(d));
        }
    };

    useEffect(() => {
        setCurrentValue(valueByFoundedStorageItem);
    }, [valueByFoundedStorageItem]);

    useEffect(() => {
        form.setFieldValue(name, currentValue);
    }, [currentValue]);

    const handleChangeValue = useCallback(
        (e: CheckboxChangeEvent) => {
            setCurrentValue(e.target.checked);
        },
        [currentValue]
    );

    return (
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
    );
};
export default FormItem;
