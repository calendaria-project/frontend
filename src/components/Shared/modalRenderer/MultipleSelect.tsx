import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { TLayoutModalData } from "data/types";
import { ISimpleDictionaryViewModel } from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { useDispatch } from "react-redux";
import { SetModalSimpleAddContractLayout } from "store/actions";
import getExtraLayoutByCode from "utils/getExtraLayoutByCode";
import { BASE_SUB_CONTRACT_INFO } from "../../Users/userItem/userExtraCard/constants";

const { Option } = AntdSelect;

interface IMultipleSelect {
    form: FormInstance;
    dataItemLayout: TLayoutModalData;
    currentDataItemInfo: any;
}

const MultipleSelect: FC<IMultipleSelect> = ({ form, dataItemLayout, currentDataItemInfo }) => {
    const dispatch = useDispatch();
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
        const initValue = currentDataItemInfo?.[dataItemLayout.propertyName];
        let layoutForAdd: TLayoutModalData[] = [];

        (initValue || []).forEach((v: any) => {
            layoutForAdd = [...layoutForAdd, ...getExtraLayoutByCode(v.code)];
        });
        dispatch(SetModalSimpleAddContractLayout([...BASE_SUB_CONTRACT_INFO, ...layoutForAdd]));

        if (initValue) {
            setSelectValue(initValue);
        }
    };

    useEffect(() => {
        form.setFieldValue([dataItemLayout.propertyName], selectValue);
    }, [selectValue]);

    useEffect(() => {
        if (dataItemLayout.propertyName === "formTypes") {
            console.log(selectValue);
            let layoutForAdd: TLayoutModalData[] = [];
            selectValue.forEach((value) => {
                layoutForAdd = [...layoutForAdd, ...getExtraLayoutByCode(value.code)];
            });
            dispatch(SetModalSimpleAddContractLayout([...BASE_SUB_CONTRACT_INFO, ...layoutForAdd]));
        }
    }, [dataItemLayout, selectValue]);

    const handleChangeValue = useCallback(
        (v: any) => {
            const currentValuesObject: ISimpleDictionaryViewModel[] | undefined =
                selectValues.filter((item) => v.includes(item.id));
            if (currentValuesObject) {
                setSelectValue(currentValuesObject);
            }
        },
        [selectValues, selectValue]
    );

    console.log(selectValues);

    console.log(selectValue);

    return (
        <AntdSelect
            mode="multiple"
            showSearch={!!dataItemLayout.withSearch}
            disabled={dataItemLayout.disabled}
            optionFilterProp={dataItemLayout.withSearch ? "children" : undefined}
            value={selectValue?.map((v) => v.id)}
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
