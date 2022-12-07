import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { TLayoutModalData } from "data/types";
import { ISimpleDictionaryViewModel } from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";

const { Option } = AntdSelect;

interface IMultipleSelect {
    form: FormInstance;
    dataItemLayout: TLayoutModalData;
    currentDataItemInfo: any;
}

const MultipleSelect: FC<IMultipleSelect> = ({ form, dataItemLayout, currentDataItemInfo }) => {
    const [selectValue, setSelectValue] = useState<ISimpleDictionaryViewModel[]>([]);
    const [selectValues, setSelectValues] = useState<ISimpleDictionaryViewModel[]>([]);

    const { getDictionaryValues } = useSimpleHttpFunctions();

    useEffect(() => {
        initSelectValues();
    }, []);

    useEffect(() => {
        initSelectValue();
    }, [selectValues, currentDataItemInfo, dataItemLayout]);

    const initSelectValues = async () => {
        const dictionaryCode = dataItemLayout.dictionaryCode;
        const url = `simple/${dictionaryCode}`;
        const currentSelectValues: ISimpleDictionaryViewModel[] = await getDictionaryValues(url);
        setSelectValues(currentSelectValues);
    };

    const initSelectValue = () => {
        const id = currentDataItemInfo?.[dataItemLayout.propertyName]?.id;
        if (id) {
            const currentSelectValue: ISimpleDictionaryViewModel | undefined = selectValues.find(
                (item) => item.id === id
            );
            if (currentSelectValue) {
                setSelectValue([currentSelectValue]);
            }
        }
    };

    useEffect(() => {
        form.setFieldValue([dataItemLayout.propertyName], selectValue);
    }, [selectValue]);

    const handleChangeValue = useCallback(
        (v: any) => {
            setSelectValue(v);
        },
        [selectValues]
    );

    return (
        <AntdSelect
            showSearch={!!dataItemLayout.withSearch}
            disabled={dataItemLayout.disabled}
            optionFilterProp={dataItemLayout.withSearch ? "children" : undefined}
            value={selectValue?.map((v) => v.nameRu)}
            placeholder={dataItemLayout.placeholder}
            onChange={handleChangeValue}
        >
            {(selectValues || []).map((el, i) => (
                <Option value={el.id} key={i}>
                    {el.nameRu}
                </Option>
            ))}
        </AntdSelect>
    );
};

export default memo(MultipleSelect);
