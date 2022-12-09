import { Col, Form, FormInstance, Modal, Row } from "antd";

import React, { FC, memo, useCallback } from "react";

import { validateMessages } from "data/validateMessages";
import { arrayKeyTypes, REDUCED_CONTRACT_INFO } from "../constants";
import { TLayoutModalData } from "data/types";
import WithFormItem, { getFormItemContent } from "components/Shared/modalRenderer";

import { CONTRACT, SUB_CONTRACT } from "data/values";

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

    const subContractCurrentLayout = useTypedSelector((state) => state.modal.contractAddLayout);

    console.log(subContractCurrentLayout);

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
                                  return (
                                      <React.Fragment key={index}>
                                          {contractType &&
                                          contractCode !== CONTRACT &&
                                          contractCode !== SUB_CONTRACT
                                              ? REDUCED_CONTRACT_INFO.map(
                                                    (dataItemLayout, index) => {
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
                                                    }
                                                )
                                              : contractType && contractCode === SUB_CONTRACT
                                              ? subContractCurrentLayout.map(
                                                    (dataItemLayout, index) => {
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
                                                    }
                                                )
                                              : (currentDataLayout || []).map(
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
                                                )}
                                      </React.Fragment>
                                  );
                              }
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
                <ModalBtns okText={okText} onCancel={handleCancel} />
            </Form>
        </Modal>
    );
};
export default memo(UserExtraCardModal);
