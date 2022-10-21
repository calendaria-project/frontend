import { Button, Col, Form, FormInstance, Modal, Row } from "antd";
import Select from "./Select";

import Input from "./Input";
import React, { FC, memo, useCallback } from "react";

import { validateMessages } from "data/validateMessages";
import { SelectedKeyTypes, Types, TInputData } from "../constants";

import "../styles.scss";
import { useTypedSelector } from "hooks/useTypedSelector";
import { getCurrentUserDataItemInfo, getSelectedKey } from "store/reducers/userReducer";
import DatePicker from "./DatePicker";

interface IUserItemModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    onFinish: (values: Object) => void;
    form: FormInstance;
    currentDataLayout: Array<TInputData>;
    currentCutInfo?: any;
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

    console.log(index);
    console.log(modalCurrentDataItemInfo);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Form
                name="basic"
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
                    {selectedKey === SelectedKeyTypes.LANGUAGE_KNOWLEDGE ||
                    selectedKey === SelectedKeyTypes.EDUCATION ||
                    selectedKey === SelectedKeyTypes.INVENTORY ||
                    selectedKey === SelectedKeyTypes.DOCUMENT ||
                    selectedKey === SelectedKeyTypes.CONTRACT
                        ? (modalCurrentDataItemInfo || []).map(
                              (dataItemInfo: any, index: number) => (
                                  <Col xl={24} xs={24} key={index}>
                                      {(currentDataLayout || []).map((dataItemLayout) => (
                                          <Form.Item
                                              key={dataItemLayout.propertyName}
                                              name={dataItemLayout.propertyName}
                                              rules={[{ required: dataItemLayout.required }]}
                                          >
                                              {dataItemLayout.type === Types.SELECT ? (
                                                  <Select
                                                      form={form}
                                                      dataItemLayout={dataItemLayout}
                                                      currentDataItemInfo={dataItemInfo}
                                                  />
                                              ) : dataItemLayout.type === Types.INPUT ? (
                                                  <Input
                                                      form={form}
                                                      dataItemLayout={dataItemLayout}
                                                      currentDataItemInfo={dataItemInfo}
                                                  />
                                              ) : dataItemLayout.type === Types.DATE ? (
                                                  <DatePicker
                                                      form={form}
                                                      dataItemLayout={dataItemLayout}
                                                      currentDataItemInfo={dataItemInfo}
                                                  />
                                              ) : null}
                                          </Form.Item>
                                      ))}
                                  </Col>
                              )
                          )
                        : (currentDataLayout || []).map((dataItemLayout, index) => (
                              <Col xl={24} xs={24} key={"" + index + dataItemLayout.propertyName}>
                                  <Form.Item
                                      key={dataItemLayout.propertyName}
                                      name={dataItemLayout.propertyName}
                                      rules={[{ required: dataItemLayout.required }]}
                                  >
                                      {dataItemLayout.type === Types.SELECT ? (
                                          <Select
                                              form={form}
                                              dataItemLayout={dataItemLayout}
                                              currentDataItemInfo={currentUserDataItemInfo}
                                          />
                                      ) : dataItemLayout.type === Types.INPUT ? (
                                          <Input
                                              dataItemLayout={dataItemLayout}
                                              currentDataItemInfo={currentUserDataItemInfo}
                                              form={form}
                                          />
                                      ) : dataItemLayout.type === Types.DATE ? (
                                          <DatePicker
                                              form={form}
                                              dataItemLayout={dataItemLayout}
                                              currentDataItemInfo={currentUserDataItemInfo}
                                          />
                                      ) : null}
                                  </Form.Item>
                              </Col>
                          ))}
                    <Col xl={24} xs={24}>
                        <Form.Item>
                            <Button className="ok-btn" type="primary" htmlType="submit">
                                {okText}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
export default memo(UserExtraCardModal);
