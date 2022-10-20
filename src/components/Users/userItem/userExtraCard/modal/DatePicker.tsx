import { DatePicker as AntdDatePicker, FormInstance } from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";
import { TInputData } from "../constants";

import moment, { Moment } from "moment";

import "../styles.scss";

interface IDatePicker {
    form: FormInstance;
    dataItemLayout: TInputData;
    currentDataItemInfo: any;
}

const DatePicker: FC<IDatePicker> = ({ form, dataItemLayout, currentDataItemInfo }) => {
    const [currentValue, setCurrentValue] = useState<Moment | null>(
        currentDataItemInfo?.[dataItemLayout.propertyName] ||
            currentDataItemInfo?.[0]?.[dataItemLayout.propertyName]
            ? moment(
                  currentDataItemInfo?.[dataItemLayout.propertyName] ??
                      currentDataItemInfo?.[0]?.[dataItemLayout.propertyName],
                  "YYYY-MM-DD"
              )
            : null
    );

    const handleChangeValue = useCallback(
        (date: any, dateString: any) => {
            form.setFieldsValue({
                [dataItemLayout.propertyName]: moment(dateString, "YYYY-MM-DD")
            });
            setCurrentValue(moment(dateString, "YYYY-MM-DD"));
        },
        [dataItemLayout]
    );

    useEffect(() => {
        form.setFieldsValue({
            [dataItemLayout.propertyName]: currentValue
        });
    }, [dataItemLayout]);

    return (
        <AntdDatePicker
            value={currentValue}
            onChange={handleChangeValue}
            className="date-picker"
            placeholder={dataItemLayout.placeholder}
        />
    );
};

export default DatePicker;
