import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { TInputData } from "../constants";
import { ISimpleDictionaryViewModel } from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { dictionaryCodesEnum } from "data/enums";

const { Option } = AntdSelect;

interface ISelect {
    form: FormInstance;
    dataItemLayout: TInputData;
    currentDataItemInfo: any;
    additionalModalFlag?: boolean;
}

const Select: FC<ISelect> = ({
    form,
    dataItemLayout,
    currentDataItemInfo,
    additionalModalFlag
}) => {
    const [selectValue, setSelectValue] = useState<ISimpleDictionaryViewModel | undefined>(
        undefined
    );
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
        setSelectValues(
            additionalModalFlag && dictionaryCode === dictionaryCodesEnum.CONTRACT_TYPE
                ? currentSelectValues.filter((v) => ["CONTRACT"].includes(v.code))
                : currentSelectValues
        );
    };

    const initSelectValue = () => {
        const id = currentDataItemInfo?.[dataItemLayout.propertyName]?.id;
        if (id) {
            const currentSelectValue = selectValues.find((item) => item.id === id);
            setSelectValue(currentSelectValue);
        }
    };

    useEffect(() => {
        form.setFieldValue([dataItemLayout.propertyName], selectValue);
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
