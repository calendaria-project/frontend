import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance } from "antd/es/form/Form";
import { Col, Form, Input, Modal, Row, Select, Typography } from "antd";
import { validateMessages } from "data/constants";
import RendererInput from "components/Shared/ModalRenderer/Input";
import ModalBtns from "components/Shared/ModalRenderer/modalBtns";
import { ISimpleDictionaryViewModel } from "interfaces";
import { appTypesEnum, layoutConstantTypes } from "data/enums";
import { appTypesEnumTranscripts } from "data/transcripts";
import FormItem from "./FormItem";
import { IUsersWithInfoModel } from "interfaces/extended";
import RemovingFormItems from "./RemovingFormItems";

const { Text } = Typography;
const { Option } = Select;

export const getRemoveAccessModalValues = (
    form: FormInstance,
    setDisabledFormItemsFlag: (v: boolean) => void,
    disabledFormItemsFlag: boolean,
    modalValues: ISimpleDictionaryViewModel[],
    selectedUserId: string | undefined
) => {
    return (
        <>
            <RemovingFormItems form={form} setDisabledFormItemsFlag={setDisabledFormItemsFlag} />
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
                            selectedUserId={selectedUserId}
                            disabledAllFlag={disabledFormItemsFlag}
                        />
                    </React.Fragment>
                ))}
        </>
    );
};

export interface RemoveRequestModal {
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

const RemoveAccessReqModal: FC<RemoveRequestModal> = ({
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
    const [disabledFormItemsFlag, setDisabledFormItemsFlag] = useState(false);

    //initial value
    useEffect(() => {
        setSelectedUserId(userId);
        form.setFieldValue("applicationUserId", userId);
    }, [userId]);

    useEffect(() => {
        form.setFieldValue(["appType"], appTypesEnum.REMOVE_ACCESS);
    }, []);

    const handleChangeSelectedUserId = useCallback(
        (v: string) => {
            setSelectedUserId(v);
            form.setFieldValue("applicationUserId", v);
        },
        [form]
    );

    console.log(selectedUserId);

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
                            <Form.Item
                                initialValue={userId}
                                name={"applicationUserId"}
                                rules={[{ required: true }]}
                            >
                                <Select
                                    value={selectedUserId}
                                    onChange={handleChangeSelectedUserId}
                                    placeholder={"Для кого"}
                                >
                                    {usersData.map((user, i) => (
                                        <Option value={user.userId} key={"" + user.userId + i}>
                                            {user.fullName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : null}
                        <Form.Item name={"appType"}>
                            <Select placeholder={"Тип заявки"} value={appTypesEnum.REMOVE_ACCESS}>
                                <Option value={appTypesEnum.REMOVE_ACCESS}>
                                    {appTypesEnumTranscripts[appTypesEnum.REMOVE_ACCESS]}
                                </Option>
                            </Select>
                        </Form.Item>
                        {getRemoveAccessModalValues(
                            form,
                            setDisabledFormItemsFlag,
                            disabledFormItemsFlag,
                            modalValues,
                            selectedUserId
                        )}
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
export default memo(RemoveAccessReqModal);
