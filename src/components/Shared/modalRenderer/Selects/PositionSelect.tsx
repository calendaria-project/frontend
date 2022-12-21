import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { TLayoutModalData } from "data/types";
import {
    //IUsersDtoViewModel,
    IPositionViewModel
} from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
// import { SetSubContractDivisionId } from "store/actions";
import { useTypedSelector } from "hooks/useTypedSelector";

const { Option } = AntdSelect;

interface ISelect {
    form: FormInstance;
    dataItemLayout: TLayoutModalData;
    currentDataItemInfo: any;
    additionalModalFlag?: boolean;
}

const PositionSelect: FC<ISelect> = ({
    form,
    dataItemLayout,
    currentDataItemInfo,
    additionalModalFlag
}) => {
    // const dispatch = useDispatch();

    const [selectValue, setSelectValue] = useState<IPositionViewModel | undefined>(undefined);
    const [selectValues, setSelectValues] = useState<IPositionViewModel[]>([]);

    const { getPositionOptionsByDivisionId } = useSimpleHttpFunctions();

    const currentDivisionId = useTypedSelector((state) => state.modal.divisionId);
    // const initialDivision = useTypedSelector((state) => state.modal.initialDivision);

    useEffect(() => {
        form.setFieldValue([dataItemLayout.propertyName], selectValue);
    }, [selectValue, currentDivisionId]);

    useEffect(() => {
        initSelectValues();
    }, [
        currentDivisionId
        //initialDivision
    ]);

    const initSelectValues = async () => {
        if (currentDivisionId) {
            const currentSelectValues: IPositionViewModel[] = await getPositionOptionsByDivisionId(
                currentDivisionId
            );

            // const initialPos = initialDivision.position;
            // if (initialPos && initialDivision.divisionId === currentDivisionId) {
            //     setSelectValues([
            //         ...currentSelectValues,
            //         { ...initialPos, createdAt: "", updatedAt: "" }
            //     ]);
            // } else {
            setSelectValues([...currentSelectValues]);
            // }
        }
    };

    useEffect(() => {
        initSelectValue();
    }, [selectValues, currentDivisionId]);

    const initSelectValue = () => {
        const positionId = currentDataItemInfo?.[dataItemLayout.propertyName]?.positionId;
        const currentSelectValue = selectValues.find((item) => item?.positionId === positionId);
        setSelectValue(currentSelectValue);
    };

    const handleChangeValue = useCallback(
        (v: any) => {
            const currentValueObject: IPositionViewModel | undefined = selectValues.find(
                (item) => item?.positionId === v
            );
            if (currentValueObject) {
                setSelectValue(currentValueObject);
            }
        },
        [dataItemLayout, selectValues]
    );

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
                <Option value={el?.positionId} key={i}>
                    {el?.nameRu}
                </Option>
            ))}
        </AntdSelect>
    );
};

export default memo(PositionSelect);
