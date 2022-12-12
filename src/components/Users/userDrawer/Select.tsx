import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { ISimpleDictionaryViewModel } from "interfaces";

const { Option } = AntdSelect;

interface ISelect {
    form: FormInstance;
    selectValues: ISimpleDictionaryViewModel[];
    propertyName: string;
    initialValue?: ISimpleDictionaryViewModel;
}

const Select: FC<ISelect> = ({ form, selectValues, propertyName, initialValue }) => {
    const [selectValue, setSelectValue] = useState<ISimpleDictionaryViewModel | undefined>(
        undefined
    );

    useEffect(() => {
        if (initialValue) {
            setSelectValue(initialValue);
        }
    }, []);

    useEffect(() => {
        form.setFieldValue(propertyName, selectValue);
    }, [selectValue]);

    const handleChangeValue = useCallback(
        (v: any) => {
            const currentValueObject: ISimpleDictionaryViewModel | undefined = selectValues.find(
                (item) => item.id === v
            );
            setSelectValue(currentValueObject);
        },
        [selectValues]
    );

    return (
        <AntdSelect value={selectValue?.nameRu} onChange={handleChangeValue}>
            {(selectValues || []).map((el, i) => (
                <Option value={el.id} key={i}>
                    {el.nameRu}
                </Option>
            ))}
        </AntdSelect>
    );
};
export default memo(Select);
