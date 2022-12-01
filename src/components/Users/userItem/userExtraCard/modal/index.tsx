import { Col, Form, FormInstance, Modal, Row, Typography } from "antd";
import Select from "./Select";

import Button from "ui/Button";

import Input from "./Input";
import React, { FC, memo, useCallback } from "react";

import { validateMessages } from "data/validateMessages";
import { Types, TInputData, arrayKeyTypes, REDUCED_CONTRACT_INFO } from "../constants";

import useStyles from "./styles";

import { useTypedSelector } from "hooks/useTypedSelector";
import { getCurrentUserDataItemInfo, getSelectedKey } from "store/reducers/userReducer";
import DatePicker from "./DatePicker";
import { useTheme } from "react-jss";

const { Text } = Typography;

export const WithFormItem: FC<{ dataItemLayout: TInputData; children: any }> = ({
    dataItemLayout,
    children
}) => {
    const formItemRules: Array<{}> =
        dataItemLayout.pattern && dataItemLayout.patternMessage
            ? [
                  { required: dataItemLayout.required },
                  { pattern: dataItemLayout.pattern, message: dataItemLayout.patternMessage }
              ]
            : [{ required: dataItemLayout.required }];
    return (
        <Form.Item
            key={dataItemLayout.propertyName}
            name={dataItemLayout.propertyName}
            rules={formItemRules}
        >
            {children}
        </Form.Item>
    );
};

export const getFormItemContent = (
    form: FormInstance,
    dataItemLayout: TInputData,
    dataItemInfo: any,
    additionalModalFlag?: boolean
) => {
    return (
        <>
            {dataItemLayout.type === Types.SELECT ? (
                <Select
                    form={form}
                    dataItemLayout={dataItemLayout}
                    currentDataItemInfo={dataItemInfo}
                    additionalModalFlag={additionalModalFlag}
                />
            ) : dataItemLayout.type === Types.INPUT || dataItemLayout.type === Types.TEXTAREA ? (
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
            ) : dataItemLayout.type === Types.TITLE ? (
                <Text strong style={{ fontSize: "18px" }}>
                    {dataItemLayout.placeholder}
                </Text>
            ) : null}
        </>
    );
};

interface IUserItemModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    onFinish: (values: Object) => void;
    form: FormInstance;
    currentDataLayout: Array<TInputData>;
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
    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

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
                <Row align={"middle"} justify={"center"} gutter={[16, 16]}>
                    <Col>
                        <Form.Item className={classes.okBtnFormItem}>
                            <Button customType={"regular"} htmlType="submit">
                                {okText}
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Button className="cancel-btn" onClick={handleCancel}>
                            Отмена
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
export default memo(UserExtraCardModal);
