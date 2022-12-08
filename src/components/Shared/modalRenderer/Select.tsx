import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { TLayoutModalData } from "data/types";
import { ICurrentUserDtoViewModel, ISimpleDictionaryViewModel } from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { dictionaryCodesEnum } from "data/enums";
import { SHORTENED_CONTRACT_ARRAY, SUB_CONTRACT } from "data/values";
import { useDispatch } from "react-redux";
import { SetModalSimpleAddContractLayout } from "../../../store/actions";
import { BASE_SUB_CONTRACT_INFO } from "../../Users/userItem/userExtraCard/constants";

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

    const currentId =
        dataItemLayout.dictionaryCode === "division"
            ? "divisionId"
            : dataItemLayout.dictionaryCode === "position"
            ? "positionId"
            : "id";

    const [selectValue, setSelectValue] = useState<any>(undefined);
    const [selectValues, setSelectValues] = useState<any[]>([]);

    const { getDictionaryValues, getCurrentUserData } = useSimpleHttpFunctions();

    useEffect(() => {
        initSelectValues();
    }, []);

    useEffect(() => {
        initSelectValue();
    }, [selectValues, currentDataItemInfo, dataItemLayout]);

    const initSelectValues = async () => {
        const dictionaryCode = dataItemLayout.dictionaryCode;
        let currCompanyId;
        if (dictionaryCode === "division") {
            const currentUser: ICurrentUserDtoViewModel = await getCurrentUserData();
            currCompanyId = currentUser.company?.companyId;
        }
        const url =
            dictionaryCode === "position"
                ? `${dictionaryCode}?page=0&size=1000&sortingRule=positionId%3AASC`
                : dictionaryCode === "division"
                ? `${dictionaryCode}?companyId=${currCompanyId}&page=0&size=1000&sortingRule=divisionId%3AASC`
                : `simple/${dictionaryCode}`;
        const currentSelectValues: ISimpleDictionaryViewModel[] = await getDictionaryValues(
            url,
            dictionaryCode
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
            if (selectValue?.code === SUB_CONTRACT) {
                dispatch(SetModalSimpleAddContractLayout(BASE_SUB_CONTRACT_INFO));
            } else {
                dispatch(SetModalSimpleAddContractLayout([]));
            }
        }
    }, [selectValue, dataItemLayout, additionalModalFlag]);

    const initSelectValue = () => {
        const id = currentDataItemInfo?.[dataItemLayout.propertyName]?.[currentId];
        if (id) {
            const currentSelectValue = selectValues.find((item) => item?.[currentId] === id);
            setSelectValue(currentSelectValue);
        }
    };

    useEffect(() => {
        form.setFieldValue([dataItemLayout.propertyName], selectValue);
    }, [selectValue]);

    const handleChangeValue = useCallback(
        (v: any) => {
            const currentValueObject: any = selectValues.find((item) => item?.[currentId] === v);
            setSelectValue(currentValueObject);
        },
        [selectValues]
    );

    console.log(selectValue, selectValues);

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
                <Option value={el?.[currentId]} key={i}>
                    {el.nameRu}
                </Option>
            ))}
        </AntdSelect>
    );
};
export default memo(Select);
