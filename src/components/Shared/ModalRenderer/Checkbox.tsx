import { Checkbox as AntdCheckbox, FormInstance } from "antd";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { TLayoutModalData } from "data/types";
import { CheckboxChangeEvent } from "antd/es/checkbox";

interface ICheckbox {
    form: FormInstance;
    dataItemLayout: TLayoutModalData;
    currentDataItemInfo: any;
}

const Checkbox: FC<ICheckbox> = ({ form, dataItemLayout, currentDataItemInfo }) => {
    const [currentValue, setCurrentValue] = useState<boolean>(false);

    useEffect(() => {
        const initialValue = currentDataItemInfo?.[dataItemLayout.propertyName];
        if (initialValue !== currentValue) {
            setCurrentValue(!!initialValue);
            form.setFieldValue([dataItemLayout.propertyName], !!initialValue);
        }
    }, [currentDataItemInfo]);

    useEffect(() => {
        form.setFieldValue([dataItemLayout.propertyName], currentValue);
    }, [currentValue]);

    // useEffect(() => {
    //     if (dataItemLayout.propertyName === TENDERIX) {
    //         dispatch(SetAddReqSelectFields({ [TENDERIX]: currentValue }));
    //     }
    //     if (dataItemLayout.propertyName === ONE_C) {
    //         dispatch(SetAddReqSelectFields({ [ONE_C]: currentValue }));
    //     }
    //     if (dataItemLayout.propertyName === SERVICE_NUMBER) {
    //         dispatch(SetAddReqSelectFields({ [SERVICE_NUMBER]: currentValue }));
    //     }
    // }, [currentValue]);

    const handleChangeValue = useCallback(
        (e: CheckboxChangeEvent) => {
            setCurrentValue(e.target.checked);
        },
        [currentValue]
    );

    return (
        <AntdCheckbox value={currentValue} onChange={handleChangeValue}>
            {dataItemLayout.placeholder}
        </AntdCheckbox>
    );
};
export default memo(Checkbox);
