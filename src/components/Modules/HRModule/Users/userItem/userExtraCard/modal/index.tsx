import { Col, Form, FormInstance, Modal, Row } from "antd";

import React, { FC, memo, useCallback } from "react";

import { arrayKeyTypes } from "../constants";
import { TLayoutModalData } from "data/types";
import WithFormItem, { getFormItemContent } from "components/Shared/modalRenderer";

import { CONTRACT, SUB_CONTRACT, REDUCED_CONTRACT_INFO, validateMessages } from "data/constants";

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
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const selectedKey = useTypedSelector((state) => getSelectedKey(state.user));
    const subContractLayout = useTypedSelector((state) => state.modal.subContractLayout);

    const currentUserDataItemInfo = useTypedSelector((state) =>
        getCurrentUserDataItemInfo(state.user)
    );

    const modalCurrentDataItemInfo =
        index === null || index === undefined
            ? currentUserDataItemInfo instanceof Array
                ? currentUserDataItemInfo
                    ? currentUserDataItemInfo
                    : [{}]
                : undefined
            : [currentUserDataItemInfo?.[index!]];

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
                              (dataItemInfo: any, index: number) => {
                                  const contractType = dataItemInfo?.contractType;
                                  const contractCode = contractType?.code;
                                  const isSubContractFlag = contractCode === SUB_CONTRACT;
                                  const isContractFlag = contractCode === CONTRACT;
                                  return (
                                      <React.Fragment key={index}>
                                          {contractType && !isContractFlag && !isSubContractFlag
                                              ? REDUCED_CONTRACT_INFO.map(
                                                    (dataItemLayout, index) => {
                                                        const span = dataItemLayout.span;
                                                        return (
                                                            <Col
                                                                key={
                                                                    "" +
                                                                    dataItemLayout.propertyName +
                                                                    index
                                                                }
                                                                span={span ? span : 24}
                                                            >
                                                                <WithFormItem
                                                                    dataItemLayout={dataItemLayout}
                                                                >
                                                                    {getFormItemContent(
                                                                        form,
                                                                        dataItemLayout,
                                                                        dataItemInfo
                                                                    )}
                                                                </WithFormItem>
                                                            </Col>
                                                        );
                                                    }
                                                )
                                              : contractType && isSubContractFlag
                                              ? subContractLayout.map((dataItemLayout, index) => {
                                                    const span = dataItemLayout.span;
                                                    return (
                                                        <Col
                                                            key={
                                                                "_" +
                                                                dataItemLayout.propertyName +
                                                                index
                                                            }
                                                            span={span ? span : 24}
                                                        >
                                                            <WithFormItem
                                                                dataItemLayout={dataItemLayout}
                                                            >
                                                                {getFormItemContent(
                                                                    form,
                                                                    dataItemLayout,
                                                                    dataItemInfo
                                                                )}
                                                            </WithFormItem>
                                                        </Col>
                                                    );
                                                })
                                              : (currentDataLayout || []).map(
                                                    (dataItemLayout, index) => {
                                                        const span = dataItemLayout.span;
                                                        return (
                                                            <Col
                                                                key={
                                                                    "__" +
                                                                    dataItemLayout.propertyName +
                                                                    index
                                                                }
                                                                span={span ? span : 24}
                                                            >
                                                                <WithFormItem
                                                                    dataItemLayout={dataItemLayout}
                                                                >
                                                                    {getFormItemContent(
                                                                        form,
                                                                        dataItemLayout,
                                                                        dataItemInfo
                                                                    )}
                                                                </WithFormItem>
                                                            </Col>
                                                        );
                                                    }
                                                )}
                                      </React.Fragment>
                                  );
                              }
                          )
                        : (currentDataLayout || []).map((dataItemLayout, index) => (
                              <Col span={24} key={"___" + index + dataItemLayout.propertyName}>
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
                <ModalBtns okText={okText} onCancel={handleCancel} />
            </Form>
        </Modal>
    );
};
export default memo(UserExtraCardModal);
