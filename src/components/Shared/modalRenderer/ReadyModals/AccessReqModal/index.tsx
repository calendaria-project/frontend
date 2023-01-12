import React, { FC, memo, useCallback, useEffect } from "react";
import { FormInstance } from "antd/es/form/Form";
import { Col, Form, Input, Modal, Row, Select, Typography } from "antd";
import { validateMessages } from "data/constants";
import RendererInput from "components/Shared/modalRenderer/Input";
import ModalBtns from "components/Shared/modalRenderer/modalBtns";
import { ISimpleDictionaryViewModel } from "interfaces";
import { appTypesEnum, layoutConstantTypes } from "data/enums";
import { appTypesEnumTranscripts } from "data/transcripts";
import FormItem from "./FormItem";
import RendererDatePicker from "components/Shared/modalRenderer/DatePicker";
import { IUsersWithInfoModel } from "interfaces/extended";

export interface AddRequestModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (val: boolean) => void;
    onFinish: (data: any) => void;
    form: FormInstance;
    userName?: string;
    usersData?: IUsersWithInfoModel[];
    modalValues: ISimpleDictionaryViewModel[];
    removeAccess?: boolean;
}

const { Text } = Typography;
const { Option } = Select;

const AccessReqModal: FC<AddRequestModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    onFinish,
    form,
    userName,
    usersData,
    modalValues,
    removeAccess
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const reqTypeValue = removeAccess ? appTypesEnum.REMOVE_ACCESS : appTypesEnum.GET_ACCESS;

    useEffect(() => {
        form.setFieldValue(["appType"], reqTypeValue);
    }, [reqTypeValue]);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel} destroyOnClose>
            <Form
                name="requestModal"
                validateMessages={validateMessages}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="directoryModal"
                form={form}
            >
                <Row align={"middle"} justify={"center"} gutter={[16, 16]}>
                    <Col xl={24} xs={24}>
                        {userName ? (
                            <Form.Item initialValue={userName} name={"userName"}>
                                <Input disabled />
                            </Form.Item>
                        ) : usersData ? (
                            <Form.Item name={"applicationUserId"}>
                                <Select placeholder={"Для кого"}>
                                    {usersData.map((user, index) => (
                                        <Option key={"" + user.userId + index} value={user.userId}>
                                            {user.fullName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : null}
                        <Form.Item name={"appType"}>
                            <Select placeholder={"Тип заявки"} value={reqTypeValue}>
                                <Option value={reqTypeValue}>
                                    {appTypesEnumTranscripts[reqTypeValue]}
                                </Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name={"endDate"}
                            rules={[{ required: true, message: "Выберите дату" }]}
                        >
                            <RendererDatePicker
                                form={form}
                                dataItemLayout={{
                                    type: layoutConstantTypes.DATE,
                                    propertyName: "endDate",
                                    placeholder: "Дедлайн заявки"
                                }}
                                currentDataItemInfo={undefined}
                            />
                        </Form.Item>
                        {(modalValues || [])
                            .sort((a, b) => a.id - b.id)
                            .map((item, index) => (
                                <React.Fragment key={item.id}>
                                    {index == 2 && (
                                        <Text strong style={{ fontSize: "18px" }}>
                                            Доступ к информационным системам
                                        </Text>
                                    )}
                                    <FormItem
                                        form={form}
                                        currentDictionary={item}
                                        removeAccess={removeAccess}
                                    />
                                </React.Fragment>
                            ))}
                        <Form.Item name={"comment"}>
                            <RendererInput
                                form={form}
                                dataItemLayout={{
                                    type: layoutConstantTypes.TEXTAREA,
                                    propertyName: "comment",
                                    placeholder: "Комментарии к записям"
                                }}
                                currentDataItemInfo={undefined}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <ModalBtns okText={okText} onCancel={handleCancel} />
            </Form>
        </Modal>
    );
};
export default memo(AccessReqModal);
