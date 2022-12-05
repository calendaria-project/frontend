import { Col, Form, FormInstance, Modal, Row } from "antd";

import Button from "ui/Button";

import React, { FC, memo, useCallback, useState, useEffect } from "react";

import { validateMessages } from "data/validateMessages";
import { SelectedKeyTypes, TInputData } from "../../constants";

import useStyles from "./styles";
import { IErrorModifiedItem } from "../../errorCodes";
import { getUserEditingNameByKey } from "utils/getUserEditingNameByKey";
import { useTheme } from "react-jss";
import ExtraValidationModal from "./modal";
import { getFormItemContent, WithFormItem } from "../index";
import { useTypedSelector } from "hooks/useTypedSelector";
import { getSelectedKey } from "store/reducers/userReducer";

interface IUserItemModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    onFinish: (values: Object) => void;
    form: FormInstance;
    currentDataLayout: Array<TInputData>;
    errorMsg?: string;
    errorArr?: IErrorModifiedItem[];
    usersId: string;
}

const UserExtraCardAdditionalModal: FC<IUserItemModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    onFinish,
    form,
    currentDataLayout,
    errorMsg,
    errorArr,
    usersId
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);
    const [extraForm] = Form.useForm();

    const selectedKey = useTypedSelector((state) => getSelectedKey(state.user));

    const [currentErr, setCurrentErr] = useState<{ error: IErrorModifiedItem; index: number }>(
        {} as { error: IErrorModifiedItem; index: number }
    );

    const [copiedErrorArr, setCopiedErrorArr] = useState<IErrorModifiedItem[] | undefined>();

    const onChangeCopiedErrorArr = (index: number, currentErr: IErrorModifiedItem) => {
        const newErrorsArr = copiedErrorArr?.map((item, itemIndex) =>
            itemIndex === index ? currentErr : item
        );
        setCopiedErrorArr(newErrorsArr);
    };

    const [extraModalVisible, setExtraModalVisible] = useState(false);

    const openExtraModal = useCallback(
        (err: IErrorModifiedItem, index: number) => () => {
            setCurrentErr({ error: err, index: index });
            setExtraModalVisible(true);
        },
        []
    );

    console.log(copiedErrorArr);

    useEffect(() => {
        setCopiedErrorArr(errorArr);
    }, [errorArr]);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Form
                name="simpleAdditionalModal"
                validateMessages={validateMessages}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="directoryModal"
                form={form}
            >
                <Row gutter={16}>
                    <Col xl={24} xs={24}>
                        {(currentDataLayout || []).map((dataItemLayout, index) => (
                            <WithFormItem
                                key={"" + dataItemLayout.propertyName + index}
                                dataItemLayout={dataItemLayout}
                            >
                                {getFormItemContent(form, dataItemLayout, undefined, true)}
                            </WithFormItem>
                        ))}
                        {selectedKey === SelectedKeyTypes.CONTRACT && errorMsg && (
                            <Col className={classes.errorMsg} span={24}>
                                {errorMsg}
                            </Col>
                        )}
                    </Col>
                </Row>
                {selectedKey === SelectedKeyTypes.CONTRACT && copiedErrorArr && (
                    <Row className={classes.errArrWrapper}>
                        {(copiedErrorArr || []).map((errItem, index) => (
                            <Row
                                key={errItem.selectedKey}
                                className={classes.errItem}
                                align={"middle"}
                                justify={"space-between"}
                            >
                                <Col className={classes.errItemTitle}>{`${
                                    errItem.field ? "Редактировать" : "Добавить"
                                } ${getUserEditingNameByKey(errItem.selectedKey)}`}</Col>
                                <Col
                                    onClick={openExtraModal(errItem, index)}
                                    className={classes.errItemAdd}
                                >
                                    {errItem.addText}
                                </Col>
                            </Row>
                        ))}
                    </Row>
                )}
                <Row align={"middle"} justify={"center"} gutter={[16, 16]}>
                    <Col>
                        <Form.Item className={classes.okBtnFormItem}>
                            <Button customType={"regular"} htmlType="submit">
                                {okText}
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Button customType={"primary"} onClick={handleCancel}>
                            Отмена
                        </Button>
                    </Col>
                </Row>
            </Form>
            <ExtraValidationModal
                okText={"Сохранить"}
                title={
                    currentErr.error?.field ? "Редактирование информации" : "Добавление информации"
                }
                isVisible={extraModalVisible}
                setIsVisible={setExtraModalVisible}
                form={extraForm}
                currentErr={currentErr.error}
                onChangeErrors={onChangeCopiedErrorArr}
                editingIndex={currentErr.index}
                usersId={usersId}
            />
        </Modal>
    );
};
export default memo(UserExtraCardAdditionalModal);
