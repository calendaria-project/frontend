import { FC, useState } from "react";
import { ITable } from "./ITable";
import { Select } from "antd";

const { Option } = Select;

const SelectTable: FC<ITable> = ({ selectionItems, onSetTabActiveKey }) => {
    const [defaultValue] = useState(sessionStorage.getItem("directoriesActiveTabId") || "1");

    const handleChangeValue = (v: string) => {
        onSetTabActiveKey(v);
    };

    return (
        <Select style={{ width: 200 }} defaultValue={defaultValue} onChange={handleChangeValue}>
            {selectionItems.map(({ key, label }) => (
                <Option key={key + label} value={key}>
                    {label}
                </Option>
            ))}
        </Select>
    );
};
export default SelectTable;
