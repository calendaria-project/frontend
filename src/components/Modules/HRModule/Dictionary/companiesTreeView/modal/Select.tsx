import { FC, useContext, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { AuthContext } from "context/AuthContextProvider";

const { Option } = AntdSelect;

interface ISelect {
    form: FormInstance;
    defaultValue?: number;
    placeholder: string;
    fieldName: string;
    url: string;
    idKey: string;
    num?: number;
}

const Select: FC<ISelect> = ({ form, defaultValue, placeholder, fieldName, url, idKey, num }) => {
    const authContext = useContext(AuthContext);

    const [selectValue, setSelectValue] = useState<number | undefined>();
    const [selectValues, setSelectValues] = useState<any[]>([]);

    useEffect(() => {
        setSelectValue(defaultValue ? defaultValue : undefined);
    }, [defaultValue]);

    const handleChangeValue = (v: any) => {
        if (num || num === 0) {
            form.setFieldValue(["companyAddresses", num, fieldName], { [idKey]: v });
        } else {
            form.setFieldValue(fieldName, { [idKey]: v });
        }
        setSelectValue(v);
    };

    useEffect(() => {
        actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token)).then(
            (data) => setSelectValues(data)
        );
    }, []);

    return (
        <AntdSelect value={selectValue} onChange={handleChangeValue} placeholder={placeholder}>
            {(selectValues || []).map((el, i) => (
                <Option value={el[idKey]} key={i}>
                    {el.nameRu}
                </Option>
            ))}
        </AntdSelect>
    );
};
export default Select;
