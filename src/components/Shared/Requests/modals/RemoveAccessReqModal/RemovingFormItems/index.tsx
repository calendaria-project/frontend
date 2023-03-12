import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { Form, FormInstance } from "antd";
import { accessRemoveTypeEnum, dictionaryCodesEnum, layoutConstantTypes } from "data/enums";
import { ISimpleDictionaryViewModel } from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import RendererDatePicker from "components/Shared/ModalRenderer/DatePicker";
import SelectComponent from "./SelectComponent";
import DocumentDropZone from "./DocumentDropZone";

interface IRemovingFormItems {
    form: FormInstance;
    setDisabledFormItemsFlag: (v: boolean) => void;
}

const MATERNITY = "maternity";
const INVESTIGATION = "investigation";
const OTHER = "other";

const RemovingFormItems: FC<IRemovingFormItems> = ({ form, setDisabledFormItemsFlag }) => {
    const [accessRmTypeCurrentValue, setAccessRmTypeCurrentValue] = useState<
        ISimpleDictionaryViewModel | undefined
    >(undefined);
    const [accessRmTypeValues, setAccessRmTypeValues] = useState<ISimpleDictionaryViewModel[]>([]);

    const [accessRmReasonCurrentValue, setAccessRmReasonCurrentValue] = useState<
        ISimpleDictionaryViewModel | undefined
    >(undefined);
    const [accessRmReasonValues, setAccessRmReasonValues] = useState<ISimpleDictionaryViewModel[]>(
        []
    );
    const tempAccessRmReasonValues = accessRmReasonValues.filter(
        (el) => el.code !== MATERNITY && el.code !== INVESTIGATION && el.code && el.code !== OTHER
    );
    const permanentAccessRmReasonValues = accessRmReasonValues.filter(
        (el) => el.code === MATERNITY || el.code === INVESTIGATION || el.code === OTHER
    );

    const { getDictionaryValues } = useSimpleHttpFunctions();

    //init all disabled to false
    useEffect(() => {
        setDisabledFormItemsFlag(false);
    }, [setDisabledFormItemsFlag]);

    useEffect(() => {
        initAccessRmTypeValues();
    }, []);

    const initAccessRmTypeValues = async () => {
        const data = await getDictionaryValues(`simple/${dictionaryCodesEnum.ACCESS_REMOVE_TYPE}`);
        setAccessRmTypeValues(data);
    };

    useEffect(() => {
        initAccessRmReasonValues();
    }, []);

    const initAccessRmReasonValues = async () => {
        const data = await getDictionaryValues(
            `simple/${dictionaryCodesEnum.ACCESS_REMOVE_REASON}`
        );
        setAccessRmReasonValues(data);
    };

    const onSetAccessRmTypeCurrentValue = useCallback(
        (v: ISimpleDictionaryViewModel | undefined) => {
            setAccessRmTypeCurrentValue(v);
            if (v?.code === accessRemoveTypeEnum.DISMISSAL) {
                setDisabledFormItemsFlag(true);
            } else {
                setDisabledFormItemsFlag(false);
            }
        },
        [setDisabledFormItemsFlag]
    );

    return (
        <>
            <Form.Item name={"accessRemoveType"} rules={[{ required: true }]}>
                <SelectComponent
                    form={form}
                    name={"accessRemoveType"}
                    selectValues={accessRmTypeValues}
                    selectValue={accessRmTypeCurrentValue}
                    setSelectValue={onSetAccessRmTypeCurrentValue}
                    placeholder={"Вид отзыва"}
                />
            </Form.Item>
            {accessRmTypeCurrentValue?.code === accessRemoveTypeEnum.TEMP && (
                <>
                    <Form.Item name={"accessRemoveReason"} rules={[{ required: true }]}>
                        <SelectComponent
                            form={form}
                            name={"accessRemoveReason"}
                            selectValues={tempAccessRmReasonValues}
                            selectValue={
                                tempAccessRmReasonValues.some(
                                    (el) => el.id === accessRmReasonCurrentValue?.id
                                )
                                    ? accessRmReasonCurrentValue
                                    : undefined
                            }
                            setSelectValue={setAccessRmReasonCurrentValue}
                            placeholder={"Причина отзыва"}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"applicationEndDate"}
                        rules={[{ required: true, message: "Выберите дату" }]}
                    >
                        <RendererDatePicker
                            form={form}
                            dataItemLayout={{
                                type: layoutConstantTypes.DATE,
                                propertyName: "applicationEndDate",
                                placeholder: "Срок"
                            }}
                            currentDataItemInfo={undefined}
                        />
                    </Form.Item>
                </>
            )}
            {accessRmTypeCurrentValue?.code === accessRemoveTypeEnum.PERMANENT && (
                <Form.Item name={"accessRemoveReason"} rules={[{ required: true }]}>
                    <SelectComponent
                        form={form}
                        name={"accessRemoveReason"}
                        selectValues={permanentAccessRmReasonValues}
                        selectValue={
                            permanentAccessRmReasonValues.some(
                                (el) => el.id === accessRmReasonCurrentValue?.id
                            )
                                ? accessRmReasonCurrentValue
                                : undefined
                        }
                        setSelectValue={setAccessRmReasonCurrentValue}
                        placeholder={"Причина отзыва"}
                    />
                </Form.Item>
            )}
            {accessRmTypeCurrentValue?.code === accessRemoveTypeEnum.DISMISSAL && (
                <Form.Item
                    name={"confirmationDocId"}
                    rules={[{ required: true, message: "Загрузите обходной лист" }]}
                >
                    <DocumentDropZone form={form} name={"confirmationDocId"} />
                </Form.Item>
            )}
        </>
    );
};
export default memo(RemovingFormItems);
