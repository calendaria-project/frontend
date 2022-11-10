import { FC, useCallback, useContext, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { TInputData } from "../constants";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { AuthContext } from "context/AuthContextProvider";

const { Option } = AntdSelect;

interface ISelect {
    form: FormInstance;
    dataItemLayout: TInputData;
    currentDataItemInfo: any;
}

interface ISelectValue {
    id: number;
    nameRu: string;
    nameKz: string;
    nameEn: string;
}

const Select: FC<ISelect> = ({ form, dataItemLayout, currentDataItemInfo }) => {
    const authContext = useContext(AuthContext);

    const [selectValue, setSelectValue] = useState<ISelectValue | undefined>({} as ISelectValue);
    const [selectValues, setSelectValues] = useState<Array<ISelectValue>>([]);

    useEffect(() => {
        const url = `simple/${dataItemLayout.dictionaryCode}`;
        actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token)).then(
            (data) => setSelectValues(data)
        );
        const id = currentDataItemInfo?.[dataItemLayout.propertyName]?.id;
        if (id) {
            const url = `simple/${dataItemLayout.dictionaryCode}/item/${id}`;
            actionMethodResultSync(
                "DICTIONARY",
                url,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => setSelectValue(data));
        }
    }, [currentDataItemInfo, dataItemLayout]);

    useEffect(() => {
        form.setFieldsValue({
            [dataItemLayout.propertyName]: selectValue
        });
    }, [currentDataItemInfo, selectValue]);

    const handleChangeValue = useCallback(
        (v: any) => {
            const currentValueObject: ISelectValue | undefined = selectValues.find(
                (item) => item.id === v
            );
            form.setFieldsValue({
                [dataItemLayout.propertyName]: currentValueObject
            });
            setSelectValue(currentValueObject);
        },
        [currentDataItemInfo, selectValue, selectValues]
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
export default Select;
