import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { TLayoutModalData, TContracts } from "data/types";
import { ISimpleDictionaryViewModel } from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { dictionaryCodesEnum } from "data/enums";
import { SHORTENED_CONTRACT_ARRAY } from "data/constants";
import { useDispatch } from "react-redux";
import { SetSelectedContractType } from "store/actions";

const { Option } = AntdSelect;

interface ISelect {
    form: FormInstance;
    dataItemLayout: TLayoutModalData;
    currentDataItemInfo: any;
    additionalModalFlag?: boolean;
}

const Select: FC<ISelect> = ({
    form,
    dataItemLayout,
    currentDataItemInfo,
    additionalModalFlag
}) => {
    const dispatch = useDispatch();

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

        const currentSelectValues: ISimpleDictionaryViewModel[] = await getDictionaryValues(
            `simple/${dictionaryCode}`
        );
        setSelectValues(
            additionalModalFlag && dictionaryCode === dictionaryCodesEnum.CONTRACT_TYPE
                ? currentSelectValues.filter((v) => SHORTENED_CONTRACT_ARRAY.includes(v.code))
                : currentSelectValues
        );
    };

    useEffect(() => {
        const dictionaryCode = dataItemLayout.dictionaryCode;
        if (additionalModalFlag && dictionaryCode === dictionaryCodesEnum.CONTRACT_TYPE) {
            dispatch(SetSelectedContractType(selectValue?.code as TContracts));
        }
    }, [selectValue, dataItemLayout, additionalModalFlag]);

    const initSelectValue = () => {
        const id = currentDataItemInfo?.[dataItemLayout.propertyName]?.id;
        if (id) {
            const currentSelectValue = selectValues.find((item) => item?.id === id);
            setSelectValue(currentSelectValue);
        }
    };

    useEffect(() => {
        form.setFieldValue([dataItemLayout.propertyName], selectValue);
    }, [selectValue]);

    const handleChangeValue = useCallback(
        (v: any) => {
            const currentValueObject: any = selectValues.find((item) => item?.id === v);
            setSelectValue(currentValueObject);
        },
        [dataItemLayout, selectValues]
    );

    return (
        <AntdSelect
            showSearch={!!dataItemLayout.withSearch}
            disabled={!additionalModalFlag ? dataItemLayout.disabled : false}
            optionFilterProp={dataItemLayout.withSearch ? "children" : undefined}
            value={selectValue?.nameRu}
            placeholder={dataItemLayout.placeholder}
            onChange={handleChangeValue}
        >
            {(selectValues || []).map((el, i) => (
                <Option value={el?.id} key={i}>
                    {el.nameRu}
                </Option>
            ))}
        </AntdSelect>
    );
};
export default memo(Select);
