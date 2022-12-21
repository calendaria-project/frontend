import { Checkbox as AntdCheckbox } from "antd";
import React, { FC, memo } from "react";
import { TLayoutModalData } from "data/types";

interface ICheckbox {
    // form: FormInstance;
    dataItemLayout: TLayoutModalData;
    // currentDataItemInfo: any;
}

const Checkbox: FC<ICheckbox> = ({ dataItemLayout }) => {
    return <AntdCheckbox defaultChecked={false}>{dataItemLayout.placeholder}</AntdCheckbox>;
};
export default memo(Checkbox);
