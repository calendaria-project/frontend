import { Col, Form, FormInstance, Modal, Row } from "antd";

import React, { FC, memo, useCallback, useEffect, useState, Suspense } from "react";

import { selectedKeyTypes } from "data/enums";
import { TLayoutModalData } from "data/types";

import useStyles from "./styles";
import { IErrorModifiedItem } from "data/errorCodes";
import { getModalEditingNameByKey } from "utils/getModalEditingNameByKey";
import { useTheme } from "react-jss";
import WithFormItem, { getFormItemContent } from "components/ModalRenderer";
import { useTypedSelector } from "hooks/useTypedSelector";
import { getSelectedKey } from "store/reducers/userReducer";
import ModalBtns from "components/ModalRenderer/modalBtns";
import { SUB_CONTRACT, validateMessages } from "data/constants";

const ExtraValidationModal = React.lazy(() => import("./validationModal"));

interface IUserItemModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    onFinish: (values: Object) => void;
    form: FormInstance;
    currentDataLayout: TLayoutModalData[];
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
        // form.resetFields();
    }, []);

    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);
    const [extraForm] = Form.useForm();

    const [extraModalVisible, setExtraModalVisible] = useState(false);
    const selectedKey = useTypedSelector((state) => getSelectedKey(state.user));

    const simpleSubContractLayout = useTypedSelector(
        (state) => state.modal.simpleSubContractLayout
    );
    const selectedContractType = useTypedSelector((state) => state.modal.selectedContractType);
    const isContractFlag = selectedKey === selectedKeyTypes.CONTRACT;

    const [currentErr, setCurrentErr] = useState<{ error: IErrorModifiedItem; errIndex: number }>(
        {} as { error: IErrorModifiedItem; errIndex: number }
    );

    const [copiedErrorArr, setCopiedErrorArr] = useState<IErrorModifiedItem[] | undefined>();

    const onChangeError = (changedErr: IErrorModifiedItem) => {
        const newErrorsArr = copiedErrorArr?.map((defaultErr, itemIndex) =>
            itemIndex === currentErr.errIndex ? changedErr : defaultErr
        );
        setCopiedErrorArr(newErrorsArr);
    };

    useEffect(() => {
        setCopiedErrorArr(errorArr);
    }, [errorArr]);

    const openExtraModal = useCallback(
        (err: IErrorModifiedItem, index: number) => () => {
            setCurrentErr({ error: err, errIndex: index });
            setExtraModalVisible(true);
        },
        []
    );

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
                    {(isContractFlag && selectedContractType === SUB_CONTRACT
                        ? simpleSubContractLayout
                        : currentDataLayout || []
                    ).map((dataItemLayout, index) => {
                        const span = dataItemLayout.span;
                        return (
                            <Col
                                key={"" + dataItemLayout.propertyName + index}
                                span={span ? span : 24}
                            >
                                <WithFormItem dataItemLayout={dataItemLayout}>
                                    {getFormItemContent(form, dataItemLayout, undefined, true)}
                                </WithFormItem>
                            </Col>
                        );
                    })}
                    {isContractFlag && errorMsg && (
                        <Col className={classes.errorMsg} span={24}>
                            {errorMsg}
                        </Col>
                    )}
                </Row>
                {isContractFlag && copiedErrorArr && !!copiedErrorArr.length && (
                    <Row className={classes.errArrWrapper}>
                        {copiedErrorArr.map((errItem, index) => (
                            <Row
                                key={errItem.selectedKey}
                                className={classes.errItem}
                                align={"middle"}
                                justify={"space-between"}
                            >
                                <Col className={classes.errItemTitle}>{`${
                                    errItem.field ? "Редактировать" : "Добавить"
                                } ${getModalEditingNameByKey(errItem.selectedKey)}`}</Col>
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
                <ModalBtns okText={okText} onCancel={handleCancel} />
            </Form>
            <Suspense>
                <ExtraValidationModal
                    okText={"Сохранить"}
                    title={currentErr.error?.field ? "Редактировать " : "Добавить "}
                    isVisible={extraModalVisible}
                    setIsVisible={setExtraModalVisible}
                    form={extraForm}
                    currentErr={currentErr.error}
                    onChangeError={onChangeError}
                    usersId={usersId}
                />
            </Suspense>
        </Modal>
    );
};
export default memo(UserExtraCardAdditionalModal);
