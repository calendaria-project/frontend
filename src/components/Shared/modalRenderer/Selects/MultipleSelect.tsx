import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { TLayoutModalData } from "data/types";
import { ISimpleDictionaryViewModel } from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { useDispatch } from "react-redux";
import { SetModalSubContractLayout, SetSimpleAddModalSubContractLayout } from "store/actions";
import getExtraLayoutByCode from "utils/getExtraLayoutByCode";
import { BASE_SUB_CONTRACT_INFO } from "data/constants";

const { Option } = AntdSelect;

interface IMultipleSelect {
    form: FormInstance;
    dataItemLayout: TLayoutModalData;
    currentDataItemInfo: any;
    additionalModalFlag?: boolean;
}

const MultipleSelect: FC<IMultipleSelect> = ({
    form,
    dataItemLayout,
    currentDataItemInfo,
    additionalModalFlag
}) => {
    const dispatch = useDispatch();
    const [selectValue, setSelectValue] = useState<ISimpleDictionaryViewModel[]>([]);
    const [selectValues, setSelectValues] = useState<ISimpleDictionaryViewModel[]>([]);

    const { getDictionaryValues } = useSimpleHttpFunctions();

    useEffect(() => {
        initSelectValues();
    }, []);

    const initSelectValues = async () => {
        const dictionaryCode = dataItemLayout.dictionaryCode;
        const url = `simple/${dictionaryCode}`;
        const currentSelectValues: ISimpleDictionaryViewModel[] = await getDictionaryValues(url);
        setSelectValues(currentSelectValues);
    };

    useEffect(() => {
        initSelectValue();
    }, [additionalModalFlag, selectValues, currentDataItemInfo, dataItemLayout]);

    useEffect(() => {
        form.setFieldValue([dataItemLayout.propertyName], selectValue);
    }, [selectValue]);

    const initSelectValue = () => {
        const initValue = currentDataItemInfo?.[dataItemLayout.propertyName];

        if (dataItemLayout.propertyName === "formTypes") {
            let layoutForAdd: TLayoutModalData[] = [];
            (initValue || []).forEach((v: any) => {
                layoutForAdd = [...layoutForAdd, ...getExtraLayoutByCode(v.code)];
            });

            if (additionalModalFlag) {
                dispatch(
                    SetSimpleAddModalSubContractLayout([...BASE_SUB_CONTRACT_INFO, ...layoutForAdd])
                );
            } else {
                dispatch(SetModalSubContractLayout([...BASE_SUB_CONTRACT_INFO, ...layoutForAdd]));
            }
        }

        if (initValue) {
            setSelectValue(initValue);
        }
    };

    useEffect(() => {
        if (dataItemLayout.propertyName === "formTypes") {
            let layoutForAdd: TLayoutModalData[] = [];
            selectValue.forEach((value) => {
                layoutForAdd = [...layoutForAdd, ...getExtraLayoutByCode(value.code)];
            });
            if (additionalModalFlag) {
                dispatch(
                    SetSimpleAddModalSubContractLayout([...BASE_SUB_CONTRACT_INFO, ...layoutForAdd])
                );
            } else {
                dispatch(SetModalSubContractLayout([...BASE_SUB_CONTRACT_INFO, ...layoutForAdd]));
            }
        }
    }, [additionalModalFlag, dataItemLayout, selectValue]);

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
            {(selectValues || []).map((el) => (
                <Option value={el.id} key={el.code}>
                    {el.nameRu}
                </Option>
            ))}
        </AntdSelect>
    );
};

export default memo(MultipleSelect);
