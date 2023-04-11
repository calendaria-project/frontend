import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormInstance } from "antd/es/form/Form";
import { IUsersWithInfoModel } from "interfaces/extended";
import { ISimpleDictionaryViewModel } from "interfaces";
import { appTypesEnum, layoutConstantTypes } from "data/enums";
import { Col, Form, Input, Modal, Row, Select } from "antd";
import { validateMessages } from "data/constants";
import { appTypesEnumTranscripts } from "data/transcripts";
import RendererInput from "components/ModalRenderer/Input";
import ModalBtns from "components/ModalRenderer/modalBtns";
import { getAccessModalValues } from "../AccessReqModal";
import { getRemoveAccessModalValues } from "../RemoveAccessReqModal";

const { Option } = Select;

export interface IUnitedAccessReqModal {
    isVisible: boolean;
    setIsVisible: (val: boolean) => void;
    onFinish: (data: any) => void;
    form: FormInstance;
    userName?: string;
    userId?: string;
    usersData?: IUsersWithInfoModel[];
    modalValues: ISimpleDictionaryViewModel[];
}

const UnitedAccessReqModal: FC<IUnitedAccessReqModal> = ({
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

    const [reqTypeValue, setReqTypeValue] = useState<string>(appTypesEnum.GET_ACCESS);
    const getAccessReqTypeFlag = reqTypeValue === appTypesEnum.GET_ACCESS;

    //initial value
    useEffect(() => {
        setSelectedUserId(userId);
        form.setFieldValue("applicationUserId", userId);
    }, [userId]);
    //
    // useEffect(() => {
    //     form.setFieldValue(["appType"], appTypesEnum.GET_ACCESS);
    // }, []);

    const handleChangeReqTypeValue = useCallback(
        (v: string) => {
            setReqTypeValue(v);
            form.setFieldValue("appType", v);
        },
        [form]
    );

    const handleChangeSelectedUserId = useCallback(
        (v: string) => {
            setSelectedUserId(v);
            form.setFieldValue("applicationUserId", v);
        },
        [form]
    );

    return (
        <Modal
            title={getAccessReqTypeFlag ? "Добавить заявку" : "Отзыв прав"}
            open={isVisible}
            footer={null}
            onCancel={handleCancel}
            destroyOnClose
        >
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
                        <Form.Item initialValue={reqTypeValue} name={"appType"}>
                            <Select
                                value={reqTypeValue}
                                onChange={handleChangeReqTypeValue}
                                placeholder={"Тип заявки"}
                            >
                                <Option value={appTypesEnum.GET_ACCESS}>
                                    {appTypesEnumTranscripts[appTypesEnum.GET_ACCESS]}
                                </Option>
                                <Option value={appTypesEnum.REMOVE_ACCESS}>
                                    {appTypesEnumTranscripts[appTypesEnum.REMOVE_ACCESS]}
                                </Option>
                            </Select>
                        </Form.Item>
                        {reqTypeValue === appTypesEnum.REMOVE_ACCESS
                            ? getRemoveAccessModalValues(
                                  form,
                                  setDisabledFormItemsFlag,
                                  disabledFormItemsFlag,
                                  modalValues,
                                  selectedUserId
                              )
                            : getAccessModalValues(modalValues, form, selectedUserId)}
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
                <ModalBtns
                    okText={getAccessReqTypeFlag ? "Добавить" : "Отправить"}
                    onCancel={handleCancel}
                />
            </Form>
        </Modal>
    );
};
export default memo(UnitedAccessReqModal);
