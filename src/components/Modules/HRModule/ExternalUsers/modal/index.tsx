import { Modal, Form, Input, Row, Col, Select } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { validateMessages } from "data/constants";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import React, { memo, useCallback, useEffect } from "react";
import { mailMessage, mailPattern, phoneMessage, phonePattern } from "data/patterns";
import PhoneInput from "utils/PhoneInput";
import AvatarDropZone from "utils/DropZones/AvatarDropZone";
import { IExternalUsersDataModel } from "interfaces/extended";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import ModalBtns from "components/Shared/ModalRenderer/modalBtns";

const { Option } = Select;

export interface ISharedExternalUserModal {
    okText: string;
    title: string;
    setIsVisible: (val: boolean) => void;
    onFinish: (data: any) => void;
    isVisible: boolean;
    form: FormInstance;
    existingData?: IExternalUsersDataModel;
}

const SharedExternalUserModal = ({
    title,
    okText,
    onFinish,
    isVisible,
    setIsVisible,
    form,
    existingData
}: ISharedExternalUserModal) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    useEffect(() => {
        if (existingData) {
            form.setFieldsValue({
                lastname: existingData.lastname,
                firstname: existingData.firstname,
                patronymic: existingData.patronymic,
                "personalContact.mobilePhoneNumber":
                    existingData.personalContact?.mobilePhoneNumber,
                "personalContact.email": existingData.personalContact?.email,
                "counterparty.companyId": existingData.counterparty?.companyId,
                "position.positionId": existingData.position?.positionId
            });
        }
    }, [existingData]);

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const { companies, positions } = useSimpleHttpFunctions();
    const userPhoto = existingData?.currentPhotoId;
    const phoneNumber = existingData?.personalContact?.mobilePhoneNumber;

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Form
                form={form}
                name="basic"
                validateMessages={validateMessages}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="directoryModal"
            >
                <Row>
                    <Col span={24}>
                        <Form.Item name={"profilePhotoId"}>
                            <AvatarDropZone form={form} userPhoto={userPhoto} withSpace={false} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            className={classes.leftFormItem}
                            name="lastname"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder={"Фамилия"} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            className={classes.rightFormItem}
                            name="firstname"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder={"Имя"} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="patronymic">
                            <Input placeholder={"Отчество"} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="personalContact.mobilePhoneNumber"
                            rules={[
                                { required: true, message: "Номер" },
                                { pattern: phonePattern, message: phoneMessage }
                            ]}
                        >
                            <PhoneInput
                                form={form}
                                placeholder={"Номер телефона"}
                                initialValue={phoneNumber}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            rules={[{ pattern: mailPattern, message: mailMessage }]}
                            name="personalContact.email"
                        >
                            <Input placeholder={"Почта"} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="counterparty.companyId"
                            rules={[{ required: true, message: "Контрагент" }]}
                        >
                            <Select placeholder={"Контрагент"} allowClear>
                                {companies.map((el, i) => (
                                    <Option key={i} value={el.companyId}>
                                        {el.nameRu}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="position.positionId" rules={[{ required: true }]}>
                            <Select
                                placeholder={"Должность"}
                                showSearch={true}
                                optionFilterProp={"children"}
                                allowClear
                            >
                                {positions.map((el, i) => (
                                    <Option key={i} children={el.nameRu} value={el.positionId} />
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <ModalBtns okText={okText} onCancel={handleCancel} />
            </Form>
        </Modal>
    );
};

export default memo(SharedExternalUserModal);
