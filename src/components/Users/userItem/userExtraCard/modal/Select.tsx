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

const Select: FC<ISelect> = ({ form, dataItemLayout, currentDataItemInfo }) => {
    const authContext = useContext(AuthContext);

    const [selectValue, setSelectValue] = useState<string | undefined>(undefined);
    const [selectValues, setSelectValues] = useState([]);

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
            ).then((data) => setSelectValue(data?.nameRu));
        }
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            [dataItemLayout.propertyName]: selectValue
        });
    }, []);

    const handleChangeValue = useCallback((v: string) => {
        form.setFieldsValue({
            [dataItemLayout.propertyName]: v
        });
    }, []);

    return (
        <AntdSelect
            value={selectValue}
            placeholder={dataItemLayout.placeholder}
            onChange={handleChangeValue}
        >
            {(selectValues || []).map(({ nameRu, id }, i) => (
                <Option value={nameRu} key={i}>
                    {nameRu}
                </Option>
            ))}
        </AntdSelect>
    );
};
export default Select;
