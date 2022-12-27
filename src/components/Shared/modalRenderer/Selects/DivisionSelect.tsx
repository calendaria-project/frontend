import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance, Select as AntdSelect } from "antd";
import { TLayoutModalData } from "data/types";
import {
    IUsersViewModel,
    IDivisionViewModel
    //IUsersViewModel
} from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { useDispatch } from "react-redux";
import {
    SetSubContractDivisionId
    //SetSubContractInitialDivisionId
} from "store/actions";
// import { useParams } from "react-router";

const { Option } = AntdSelect;

interface ISelect {
    form: FormInstance;
    dataItemLayout: TLayoutModalData;
    currentDataItemInfo: any;
    additionalModalFlag?: boolean;
}

const DivisionSelect: FC<ISelect> = ({
    form,
    dataItemLayout,
    currentDataItemInfo,
    additionalModalFlag
}) => {
    // const { usersId } = useParams();
    const dispatch = useDispatch();

    const [selectValue, setSelectValue] = useState<IDivisionViewModel | undefined>(undefined);
    const [selectValues, setSelectValues] = useState<IDivisionViewModel[]>([]);

    const [currentUserDivisionId, setCurrentUserDivisionId] = useState<number | undefined>(
        undefined
    );

    const {
        getDivisionOptions,
        getCurrentUserData
        //getUserData
    } = useSimpleHttpFunctions();

    useEffect(() => {
        // if (usersId) {
        initSelectValues();
        // }
    }, []); //[usersId]);

    const initSelectValues = async () => {
        const currentUser: IUsersViewModel = await getCurrentUserData();
        if (currentUser) {
            const currentCompanyId = currentUser.company?.companyId;
            const divisionId = currentUser.divisionId;
            const currentSelectValues: IDivisionViewModel[] = await getDivisionOptions(
                currentCompanyId
            );
            setCurrentUserDivisionId(divisionId);
            setSelectValues(currentSelectValues);
        }

        // const user: IUsersViewModel = await getUserData(usersId!);
        // if (user) {
        //     const currentCompanyId = user.company?.companyId;
        //     const divisionId = user?.division?.divisionId;
        //     const position = user?.position;
        //     const currentSelectValues: IDivisionViewModel[] = await getDivisionOptions(
        //         currentCompanyId
        //     );
        //     dispatch(SetSubContractInitialDivisionId({ divisionId, position }));
        //     setCurrentUserDivisionId(divisionId);
        //     setSelectValues(currentSelectValues);
        // }
    };

    useEffect(() => {
        initSelectValue();
    }, [selectValues, currentDataItemInfo, dataItemLayout]);

    const initSelectValue = () => {
        const divisionId = currentDataItemInfo?.[dataItemLayout.propertyName]?.divisionId;
        if (divisionId) {
            const currentSelectValue = selectValues.find((item) => item?.divisionId === divisionId);
            setSelectValue(currentSelectValue);
            dispatch(SetSubContractDivisionId(divisionId));
        } else if (currentUserDivisionId) {
            dispatch(SetSubContractDivisionId(currentUserDivisionId));
        }
    };

    useEffect(() => {
        form.setFieldValue([dataItemLayout.propertyName], selectValue);
    }, [selectValue]);

    const handleChangeValue = useCallback(
        (v: any) => {
            const currentValueObject: IDivisionViewModel | undefined = selectValues.find(
                (item) => item?.divisionId === v
            );
            if (currentValueObject) {
                setSelectValue(currentValueObject);
                dispatch(SetSubContractDivisionId(currentValueObject.divisionId));
            }
        },
        [dataItemLayout, selectValue, selectValues]
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
                <Option value={el?.divisionId} key={i}>
                    {el.nameRu}
                </Option>
            ))}
        </AntdSelect>
    );
};

export default memo(DivisionSelect);
