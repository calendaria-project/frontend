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
import { useContext, useEffect } from "react";
import moment from "moment";
const { Option } = Select;
const { Title } = Typography;
import _ from "lodash";

import UIButton from "ui/Button";

import { parsePointObjectKey } from "utils/parsePointObjectKey";

import AvatarDropZone from "utils/DropZones/AvatarDropZone";
// import SignDropZone from "./DropZones/SignDropZone";
import { useInitialData } from "./hooks/useInitialData";
import { removeEmptyValuesFromAnyLevelObject } from "utils/removeObjectProperties";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { inputLengthHandler } from "utils/inputLengthHandler";

export interface IUserEditDrawer {
    userPhoto: string | null;
    // userSign: string | null;
    userData: any;
    companyId: string | undefined;
    companyName: string | undefined;
    open: boolean;
    setOpen: (val: boolean) => void;
    onFinishEditingUser: (data: any) => void;
}

export const UserEditDrawer = ({
    userPhoto,
    // userSign,
    userData,
    open,
    setOpen,
    companyName,
    onFinishEditingUser,
    companyId
}: IUserEditDrawer) => {
    const [form] = Form.useForm();
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const { divisions, positions, sexes } = useInitialData(companyId);

    useEffect(() => {
        form.setFieldsValue({
            lastname: userData.lastname,
            firstname: userData.firstname,
            patronymic: userData.patronymic,
            iin: userData.iin,
            "sex.id": userData?.sex?.id,
            birthDate: moment(userData?.birthDate, "YYYY-MM-DD"),
            employmentDate: moment(userData?.employmentDate, "YYYY-MM-DD"),
            "division.divisionId": userData?.division?.divisionId,
            "position.positionId": userData?.position?.positionId,
            profilePhotoId: userData?.profilePhotoId,
            signFileId: userData?.signFileId
        });
    }, [userData]);

    const onClose = () => {
        setOpen(false);
    };

    const handleEditUser = () => {
        form.validateFields().then((e) => {
            let data = parsePointObjectKey(e, companyId, form);
            const currentData = _.merge(userData, data);
            editUser(removeEmptyValuesFromAnyLevelObject(currentData));
        });
    };

    const editUser = (data: any) => {
        actionMethodResultSync("USER", "user", "put", getRequestHeader(authContext.token), data)
            .then((data) => {
                onFinishEditingUser(data);
                message.success("Успешно отредактирован");
                onClose();
            })
            .catch(() => message.error("Ошибка редактирования"));
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
                    <UIButton customType={"regular"} onClick={handleEditUser} type="primary">
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
                            <Title level={2}>Редактировать текущего сотрудника *</Title>
                        </Space>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                    <Col span={8}>
                        <AvatarDropZone form={form} userPhoto={userPhoto} />
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
                            <Col span={16}>
                                <Form.Item
                                    name="birthDate"
                                    label="Дата рождения"
                                    rules={[{ required: true, message: "Дата рождения" }]}
                                >
                                    <DatePicker
                                        value={moment(userData?.birthDate, "YYYY-MM-DD")}
                                        style={{ width: "100%" }}
                                    />
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
                                    <DatePicker style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            {/*<Col span={8}>*/}
                            {/*    <SignDropZone form={form} userSign={userSign} />*/}
                            {/*</Col>*/}
                        </Row>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={24} className={classes.infoTitleRow}>
                    <Col>
                        <Space>
                            <DownOutlined />
                            <Title level={2}>Редактировать информацию о подразделении *</Title>
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
                                <PlusOutlined color={classes.plusIcon} />
                            </div>
                            <Button className={classes.uploadBtn} color="red" type="text">
                                Добавить
                            </Button>
                            <Button className={classes.deleteBtn} color="red" type="text">
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
                                <Form.Item name="division.divisionId" label="Подразделение">
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
                                <Form.Item name="position.positionId" label="Должность">
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
