import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance } from "antd/es/form/Form";
import { Col, Form, Input, Modal, Row, Select, Typography } from "antd";
import { validateMessages } from "data/constants";
import RendererInput from "components/ModalRenderer/Input";
import ModalBtns from "components/ModalRenderer/modalBtns";
import { ISimpleDictionaryViewModel } from "interfaces";
import { appTypesEnum, layoutConstantTypes } from "data/enums";
import { appTypesEnumTranscripts } from "data/transcripts";
import FormItem from "./FormItem";
import { IUsersWithInfoModel } from "interfaces/extended";

const { Text } = Typography;
const { Option } = Select;

export const getAccessModalValues = (
    modalValues: ISimpleDictionaryViewModel[],
    form: FormInstance,
    selectedUserId: string | undefined
) => {
    return (modalValues || [])
        .sort((a, b) => a.id - b.id)
        .map((item, index) => (
            <React.Fragment key={item.id}>
                {index == 2 && (
                    <Text strong style={{ fontSize: "18px" }}>
                        Доступ к информационным системам
                    </Text>
                )}
                <FormItem form={form} currentDictionary={item} selectedUserId={selectedUserId} />
            </React.Fragment>
        ));
};

export interface IAccessReqModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (val: boolean) => void;
    onFinish: (data: any) => void;
    form: FormInstance;
    userName?: string;
    userId?: string;
    usersData?: IUsersWithInfoModel[];
    modalValues: ISimpleDictionaryViewModel[];
}

const AccessReqModal: FC<IAccessReqModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    onFinish,
    form,
    userName,
    userId,
    usersData,
    modalValues
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);

    useEffect(() => {
        form.setFieldValue("applicationUserId", userId);
        setSelectedUserId(userId);
    }, [userId]);

    useEffect(() => {
        form.setFieldValue(["appType"], appTypesEnum.GET_ACCESS);
    }, []);

    const handleChangeSelectedUserId = useCallback(
        (v: string) => {
            setSelectedUserId(v);
            form.setFieldValue("applicationUserId", v);
        },
        [form]
    );

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
                        {userName && userId ? (
                            <Form.Item initialValue={userName} name={"userName"}>
                                <Input disabled />
                            </Form.Item>
                        ) : usersData ? (
                            <Form.Item name={"applicationUserId"}>
                                <Select
                                    value={selectedUserId}
                                    onChange={handleChangeSelectedUserId}
                                    placeholder={"Для кого"}
                                >
                                    {usersData.map((user, index) => (
                                        <Option key={"" + user.userId + index} value={user.userId}>
                                            {user.fullName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : null}
                        <Form.Item name={"appType"}>
                            <Select placeholder={"Тип заявки"} value={appTypesEnum.GET_ACCESS}>
                                <Option value={appTypesEnum.GET_ACCESS}>
                                    {appTypesEnumTranscripts[appTypesEnum.GET_ACCESS]}
                                </Option>
                            </Select>
                        </Form.Item>
                        {getAccessModalValues(modalValues, form, selectedUserId)}
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
