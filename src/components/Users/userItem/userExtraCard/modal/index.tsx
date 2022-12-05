import { Col, Form, FormInstance, Modal, Row } from "antd";

import React, { FC, memo, useCallback } from "react";

import { validateMessages } from "data/validateMessages";
import { arrayKeyTypes, REDUCED_CONTRACT_INFO } from "../constants";
import { TLayoutModalData } from "data/types";
import WithFormItem, { getFormItemContent } from "components/Shared/modalRenderer";

import { useTypedSelector } from "hooks/useTypedSelector";
import { getCurrentUserDataItemInfo, getSelectedKey } from "store/reducers/userReducer";
import ModalBtns from "components/Shared/modalRenderer/modalBtns";

interface IUserItemModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    onFinish: (values: Object) => void;
    form: FormInstance;
    currentDataLayout: TLayoutModalData[];
    index?: number;
}

const UserExtraCardModal: FC<IUserItemModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    onFinish,
    form,
    currentDataLayout,
    index
}) => {
    const selectedKey = useTypedSelector((state) => getSelectedKey(state.user));
    const currentUserDataItemInfo = useTypedSelector((state) =>
        getCurrentUserDataItemInfo(state.user)
    );

    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const modalCurrentDataItemInfo =
        index === null || index === undefined
            ? currentUserDataItemInfo instanceof Array
                ? currentUserDataItemInfo
                    ? currentUserDataItemInfo
                    : [{}]
                : undefined
            : [currentUserDataItemInfo?.[index!]];

    console.log(modalCurrentDataItemInfo);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Form
                name="userExtraCardModal"
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
                    {arrayKeyTypes.includes(selectedKey)
                        ? (modalCurrentDataItemInfo || []).map(
                              (dataItemInfo: any, index: number) => (
                                  <Col xl={24} xs={24} key={index}>
                                      {dataItemInfo?.contractType &&
                                      dataItemInfo.contractType.code !== "CONTRACT"
                                          ? REDUCED_CONTRACT_INFO.map((dataItemLayout, index) => (
                                                <WithFormItem
                                                    key={"_" + dataItemLayout.propertyName + index}
                                                    dataItemLayout={dataItemLayout}
                                                >
                                                    {getFormItemContent(
                                                        form,
                                                        dataItemLayout,
                                                        dataItemInfo
                                                    )}
                                                </WithFormItem>
                                            ))
                                          : (currentDataLayout || []).map(
                                                (dataItemLayout, index) => (
                                                    <WithFormItem
                                                        key={
                                                            "" + dataItemLayout.propertyName + index
                                                        }
                                                        dataItemLayout={dataItemLayout}
                                                    >
                                                        {getFormItemContent(
                                                            form,
                                                            dataItemLayout,
                                                            dataItemInfo
                                                        )}
                                                    </WithFormItem>
                                                )
                                            )}
                                  </Col>
                              )
                          )
                        : (currentDataLayout || []).map((dataItemLayout, index) => (
                              <Col xl={24} xs={24} key={"" + index + dataItemLayout.propertyName}>
                                  <WithFormItem dataItemLayout={dataItemLayout}>
                                      {getFormItemContent(
                                          form,
                                          dataItemLayout,
                                          currentUserDataItemInfo
                                      )}
                                  </WithFormItem>
                              </Col>
                          ))}
                </Row>
                <ModalBtns okText={okText} onClick={handleCancel} />
            </Form>
        </Modal>
    );
};
export default memo(UserExtraCardModal);
