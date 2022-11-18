import { DownOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Drawer,
    Form,
    Input,
    message,
    Row,
    Select,
    Space,
    Typography
} from "antd";
import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { useContext } from "react";
const { Option } = Select;
const { Title } = Typography;

import UIButton from "ui/Button";

import {
    mailPattern,
    phonePattern,
    mailMessage,
    phoneMessage
} from "components/Users/userItem/userExtraCard/constants";
import { parsePointObjectKey } from "utils/parsePointObjectKey";
import AvatarDropZone from "utils/DropZones/AvatarDropZone";
// import SignDropZone from "./DropZones/SignDropZone";
import { useInitialData } from "./hooks/useInitialData";
import { removeEmptyValuesFromAnyLevelObject } from "utils/removeObjectProperties";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import PhoneInput from "utils/PhoneInput";
import { inputLengthHandler } from "utils/inputLengthHandler";

export interface IUserAddDrawer {
    companyId: string | undefined;
    companyName: string | undefined;
    open: boolean;
    setOpen: (val: boolean) => void;
    onFinishCreatingUser: (data: any) => void;
}

export const UserAddDrawer = ({
    open,
    setOpen,
    companyName,
    onFinishCreatingUser,
    companyId
}: IUserAddDrawer) => {
    const [form] = Form.useForm();
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const { divisions, positions, sexes } = useInitialData(companyId);

    const onClose = () => {
        setOpen(false);
    };

    const handleCreateUser = () => {
        form.validateFields().then((e) => {
            let data = removeEmptyValuesFromAnyLevelObject(parsePointObjectKey(e, companyId, form));
            createUser(data);
        });
    };

    const createUser = (data: any) => {
        console.log(data);
        actionMethodResultSync("USER", "user", "post", getRequestHeader(authContext.token), data)
            .then((data) => {
                onFinishCreatingUser(data);
                message.success("Успешно создано");
                onClose();
            })
            .catch(() => message.error("Ошибка создания"));
    };

    return (
        <Drawer
            title="Вернуться назад"
            width={"100vw"}
            onClose={onClose}
            open={open}
            bodyStyle={{ paddingBottom: 80 }}
            closeIcon={<LeftOutlined />}
            extra={
                <Space>
                    <UIButton customType={"primary"} onClick={onClose}>
                        Отменить
                    </UIButton>
                    <UIButton customType={"regular"} onClick={handleCreateUser} type="primary">
                        Сохранить
                    </UIButton>
                </Space>
            }
        >
            <Form form={form} layout="vertical" className={classes.userForm}>
                <Row gutter={24} className={classes.infoTitleRow}>
                    <Col>
                        <Space>
                            <DownOutlined />
                            <Title level={2}>Добавить нового сотрудника *</Title>
                        </Space>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                    <Col span={8}>
                        <AvatarDropZone form={form} />
                    </Col>
                    <Col span={16}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="lastname"
                                    label="Фамилия"
                                    rules={[{ required: true, message: "Фамилия" }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="firstname"
                                    label="Имя"
                                    rules={[{ required: true, message: "Имя" }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="patronymic" label="Отчество">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="iin"
                                    label="ИИН"
                                    rules={[{ required: true, message: "ИИН" }]}
                                >
                                    <Input
                                        type="number"
                                        onKeyPress={inputLengthHandler}
                                        maxLength={12}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    rules={[{ pattern: mailPattern, message: mailMessage }]}
                                    name="personalContact.email"
                                    label="Почта"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="personalContact.mobilePhoneNumber"
                                    rules={[
                                        { required: true, message: "Номер" },
                                        { pattern: phonePattern, message: phoneMessage }
                                    ]}
                                    label="Номер"
                                >
                                    <PhoneInput form={form} />
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item
                                    name="birthDate"
                                    label="Дата рождения"
                                    rules={[{ required: true, message: "Дата рождения" }]}
                                >
                                    <DatePicker className={classes.datePicker} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="sex.id"
                                    label="Пол"
                                    rules={[{ required: true, message: "Пол" }]}
                                >
                                    <Select allowClear>
                                        {sexes.map((el, i) => (
                                            <Option key={i} children={el.nameRu} value={el.id} />
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="employmentDate"
                                    label="Дата приема на работу"
                                    rules={[{ required: true, message: "Дата приема на работу" }]}
                                >
                                    <DatePicker className={classes.datePicker} />
                                </Form.Item>
                            </Col>
                            {/*<Col span={8}>*/}
                            {/*    <SignDropZone form={form} />*/}
                            {/*</Col>*/}
                        </Row>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={24} className={classes.infoTitleRow}>
                    <Col>
                        <Space>
                            <DownOutlined />
                            <Title level={2}>Добавить информацию о подразделении *</Title>
                        </Space>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                    <Col span={8}>
                        <Space
                            className={classes.userTitleSpace}
                            direction="vertical"
                            align="center"
                        >
                            <Title level={3}>Информация о компании</Title>
                            <div className={classes.avatarWrap}>
                                <PlusOutlined className={classes.plusIcon} />
                            </div>
                            <Button className={classes.uploadBtn} type="text">
                                Добавить
                            </Button>
                            <Button className={classes.deleteBtn} type="text">
                                Удалить
                            </Button>
                        </Space>
                    </Col>
                    <Col span={16}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    // noStyle
                                    label="Название компании"
                                    shouldUpdate={() => companyName !== undefined}
                                >
                                    <Input readOnly value={companyName} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    rules={[{ required: true, message: "Подразделение" }]}
                                    name="division.divisionId"
                                    label="Подразделение"
                                >
                                    <Select allowClear>
                                        {divisions.map((el, i) => (
                                            <Option
                                                key={i}
                                                children={el.nameRu}
                                                value={el.divisionId}
                                            />
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    rules={[{ required: true, message: "Должность" }]}
                                    name="position.positionId"
                                    label="Должность"
                                >
                                    <Select allowClear>
                                        {positions.map((el, i) => (
                                            <Option
                                                key={i}
                                                children={el.nameRu}
                                                value={el.positionId}
                                            />
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};
