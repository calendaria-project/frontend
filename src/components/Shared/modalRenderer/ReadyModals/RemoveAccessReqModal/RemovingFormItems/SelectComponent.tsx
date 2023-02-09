import React, { FC, memo, useCallback, useEffect } from "react";
import { FormInstance, Select } from "antd";
import { ISimpleDictionaryViewModel } from "interfaces";

interface IRemovingFormItems {
    form: FormInstance;
    name: string;
    selectValues: ISimpleDictionaryViewModel[];
    selectValue: ISimpleDictionaryViewModel | undefined;
    setSelectValue: (v: ISimpleDictionaryViewModel | undefined) => void;
    placeholder: string;
}

const { Option } = Select;

const SelectComponent: FC<IRemovingFormItems> = ({
    form,
    name,
    selectValues,
    selectValue,
    setSelectValue,
    placeholder
}) => {
    useEffect(() => {
        form.setFieldValue(name, selectValue);
    }, [selectValue]);

    const handleChange = useCallback(
        (v: any) => {
            const currentValueObject: ISimpleDictionaryViewModel | undefined = selectValues.find(
                (item) => item.id === v
            );
            setSelectValue(currentValueObject);
        },
        [selectValues]
    );

    return (
        <Select value={selectValue?.id} onChange={handleChange} placeholder={placeholder}>
            {selectValues.map((rmTypeItem, i) => (
                <Option value={rmTypeItem.id} key={i}>
                    {rmTypeItem.nameRu}
                </Option>
            ))}
        </Select>
    );
};
export default memo(SelectComponent);
