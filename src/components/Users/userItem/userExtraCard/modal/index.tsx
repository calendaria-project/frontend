import { Button, Col, Form, FormInstance, Modal, Row } from "antd";
import Select from "./Select";

import Input from "./Input";
import React, { FC, memo, useCallback, useState } from "react";

import { validateMessages } from "data/validateMessages";
import { SelectedKeyTypes, Types, TInputData } from "../constants";

import "../styles.scss";
import { useTypedSelector } from "hooks/useTypedSelector";
import { getCurrentUserDataItemInfo, getSelectedKey } from "store/reducers/userReducer";

interface IUserItemModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    onFinish: (values: Object) => void;
    form: FormInstance;
    currentDataLayout: Array<TInputData>;
}

const UserExtraCardModal: FC<IUserItemModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    onFinish,
    form,
    currentDataLayout
}) => {
    const selectedKey = useTypedSelector((state) => getSelectedKey(state.user));
    const currentUserDataItemInfo = useTypedSelector((state) =>
        getCurrentUserDataItemInfo(state.user)
    );

    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const [modalCurrentDataItemInfo] = useState(
        currentUserDataItemInfo instanceof Array ? currentUserDataItemInfo : [{}]
    );

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
                    {selectedKey === SelectedKeyTypes.EDUCATION ||
                    selectedKey === SelectedKeyTypes.LANGUAGE_KNOWLEDGE
                        ? modalCurrentDataItemInfo.map((dataItemInfo, index) => (
                              <Col xl={24} xs={24} key={index}>
                                  {currentDataLayout.map((dataItemLayout) => (
                                      <Form.Item
                                          key={dataItemLayout.propertyName}
                                          name={dataItemLayout.propertyName}
                                          rules={[{ required: dataItemLayout.required }]}
                                      >
                                          <Select
                                              form={form}
                                              dataItemLayout={dataItemLayout}
                                              currentDataItemInfo={dataItemInfo}
                                          />
                                      </Form.Item>
                                  ))}
                              </Col>
                          ))
                        : currentDataLayout.map((dataItemLayout, index) => (
                              <Col xl={24} xs={24} key={"" + index + dataItemLayout.propertyName}>
                                  {dataItemLayout.type === Types.SELECT ? (
                                      <Form.Item
                                          name={dataItemLayout.propertyName}
                                          rules={[{ required: dataItemLayout.required }]}
                                      >
                                          <Select
                                              form={form}
                                              dataItemLayout={dataItemLayout}
                                              currentDataItemInfo={currentUserDataItemInfo}
                                          />
                                      </Form.Item>
                                  ) : (
                                      <Form.Item
                                          name={dataItemLayout.propertyName}
                                          rules={[{ required: dataItemLayout.required }]}
                                      >
                                          <Input
                                              dataItemLayout={dataItemLayout}
                                              currentDataItemInfo={currentUserDataItemInfo}
                                              form={form}
                                          />
                                      </Form.Item>
                                  )}
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
