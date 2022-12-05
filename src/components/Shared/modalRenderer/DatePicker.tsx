import { DatePicker as AntdDatePicker, FormInstance } from "antd";
import React, { FC, useCallback, useEffect, useState, memo } from "react";
import { TLayoutModalData } from "data/types";
import moment, { Moment } from "moment";
import useStyles from "./styles";

interface IDatePicker {
    form: FormInstance;
    dataItemLayout: TLayoutModalData;
    currentDataItemInfo: any;
}

const DatePicker: FC<IDatePicker> = ({ form, dataItemLayout, currentDataItemInfo }) => {
    const classes = useStyles();

    const [currentValue, setCurrentValue] = useState<Moment | null>(null);

    useEffect(() => {
        console.log(currentDataItemInfo?.[dataItemLayout.propertyName]);
        setCurrentValue(
            currentDataItemInfo?.[dataItemLayout.propertyName]
                ? moment(currentDataItemInfo?.[dataItemLayout.propertyName], "YYYY-MM-DD")
                : null
        );
    }, []);

    useEffect(() => {
        form.setFieldValue([dataItemLayout.propertyName], currentValue);
    }, [currentValue]);

    const handleChangeValue = useCallback((date: any, dateSting: string) => {
        setCurrentValue(moment(dateSting, "YYYY-MM-DD"));
    }, []);

    return (
        <AntdDatePicker
            allowClear={false}
            value={currentValue}
            onChange={handleChangeValue}
            className={classes.datePicker}
            placeholder={dataItemLayout.placeholder}
        />
    );
};

export default memo(DatePicker);
