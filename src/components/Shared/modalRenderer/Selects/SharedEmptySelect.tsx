import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";

const { Option } = AntdSelect;

interface ISelect {
    form: FormInstance;
    id: string;
    selectValues: any[];
    propertyName: string;
    initialValue?: any;
    placeholder?: string;
}

const SharedEmptySelect: FC<ISelect> = ({
    form,
    selectValues,
    propertyName,
    initialValue,
    id,
    placeholder
}) => {
    const [selectValue, setSelectValue] = useState<any | undefined>(undefined);

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
            const currentValueObject: any | undefined = selectValues.find((item) => item[id] === v);
            setSelectValue(currentValueObject);
        },
        [selectValues]
    );

    return (
        <AntdSelect
            placeholder={placeholder}
            value={selectValue?.nameRu}
            onChange={handleChangeValue}
        >
            {(selectValues || []).map((el, i) => (
                <Option value={el[id]} key={i}>
                    {el.nameRu}
                </Option>
            ))}
        </AntdSelect>
    );
};
export default memo(SharedEmptySelect);
