import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { TInputData } from "../constants";
import { ISimpleDictionaryModel } from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";

const { Option } = AntdSelect;

interface ISelect {
    form: FormInstance;
    dataItemLayout: TInputData;
    currentDataItemInfo: any;
}

const Select: FC<ISelect> = ({ form, dataItemLayout, currentDataItemInfo }) => {
    const [selectValue, setSelectValue] = useState<ISimpleDictionaryModel | undefined>(undefined);
    const [selectValues, setSelectValues] = useState<ISimpleDictionaryModel[]>([]);

    const { getDictionaryValues } = useSimpleHttpFunctions();

    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        const url = `simple/${dataItemLayout.dictionaryCode}`;
        const currentSelectValues: ISimpleDictionaryModel[] = await getDictionaryValues(url);
        setSelectValues(currentSelectValues);

        const id = currentDataItemInfo?.[dataItemLayout.propertyName]?.id;
        if (id) {
            const currentSelectValue = currentSelectValues.find((item) => item.id === id);
            setSelectValue(currentSelectValue);
        }
    };

    console.log(selectValues);

    useEffect(() => {
        form.setFieldValue([dataItemLayout.propertyName], selectValue);
    }, [selectValue]);

    const handleChangeValue = useCallback(
        (v: any) => {
            const currentValueObject: ISimpleDictionaryModel | undefined = selectValues.find(
                (item) => item.id === v
            );
            setSelectValue(currentValueObject);
        },
        [selectValues]
    );

    return (
        <AntdSelect
            showSearch={!!dataItemLayout.withSearch}
            optionFilterProp={dataItemLayout.withSearch ? "children" : undefined}
            value={selectValue?.nameRu}
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
export default memo(Select);
