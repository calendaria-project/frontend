import { Col, Form, FormInstance, Modal, Row } from "antd";

import React, { FC, memo, useCallback, useState, useEffect } from "react";

import { validateMessages } from "data/validateMessages";
import { selectedKeyTypes } from "data/enums";
import { TLayoutModalData } from "data/types";

import useStyles from "./styles";
import { IErrorModifiedItem } from "data/errorCodes";
import { getModalEditingNameByKey } from "utils/getModalEditingNameByKey";
import { useTheme } from "react-jss";
import ExtraValidationModal from "./validationModal";
import WithFormItem, { getFormItemContent } from "components/Shared/modalRenderer";
import { useTypedSelector } from "hooks/useTypedSelector";
import { getSelectedKey } from "store/reducers/userReducer";
import ModalBtns from "components/Shared/modalRenderer/modalBtns";

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
    }, []);

    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);
    const [extraForm] = Form.useForm();

    const [extraModalVisible, setExtraModalVisible] = useState(false);
    const selectedKey = useTypedSelector((state) => getSelectedKey(state.user));
    const simpleContractLayout = useTypedSelector((state) => state.modal.contractAddLayout);
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

    console.log(copiedErrorArr);

    console.log(currentDataLayout);

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
                    {(isContractFlag && simpleContractLayout.length
                        ? simpleContractLayout
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
        </Modal>
    );
};
export default memo(UserExtraCardAdditionalModal);
