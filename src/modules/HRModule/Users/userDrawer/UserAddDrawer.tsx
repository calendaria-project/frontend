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
import { getRequestHeader } from "http/common";
import { useCallback, useContext, useState } from "react";
const { Option } = Select;
const { Title } = Typography;

import UIButton from "ui/Button";

import { mailPattern, phonePattern, mailMessage, phoneMessage } from "data/patterns";
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
// import ValuesSelect from "./Select";
import axios from "axios";
import getCurrentSimpleError from "utils/getCurrentSimpleError";
import SharedEmptySelect from "components/ModalRenderer/selects/SharedEmptySelect";

export interface IUserAddDrawer {
    companyId?: number;
    companyName: string | undefined;
    open: boolean;
    setOpen: (val: boolean) => void;
    onFinishCreatingUser: (data: any) => void;
}

const UserAddDrawer = ({
    companyId,
    companyName,
    open,
    setOpen,
    onFinishCreatingUser
}: IUserAddDrawer) => {
    const [form] = Form.useForm();
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const [currentDivisionId, setCurrentDivisionId] = useState<number | undefined>(undefined);

    const handleCurrentDivisionId = useCallback(
        (v: number) => {
            setCurrentDivisionId(v);
            form.resetFields(["position.positionId"]);
        },
        [form]
    );

    const { divisions, positions, sexes } = useInitialData(companyId, currentDivisionId);

    const onClose = () => {
        setOpen(false);
    };

    const handleCreateUser = () => {
        form.validateFields().then((e) => {
            let data = removeEmptyValuesFromAnyLevelObject(
                parsePointObjectKey(e, companyId + "", form)
            );
            createUser(data);
        });
    };

    const createUser = (data: any) => {
        console.log(data);
        const url = `${process.env.USER_URL}user`;
        axios
            .post(url, data, getRequestHeader(authContext.token))
            .then((res) => {
                const result = res.data;
                onFinishCreatingUser(result);
                message.success("Успешно создано");
                onClose();
            })
            .catch((err) => {
                let currErr = getCurrentSimpleError(err.response?.data?.code);
                message.error(currErr ? currErr : "Ошибка создания");
            });
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
                                    rules={[
                                        { required: true, message: "ИИН" },
                                        {
                                            pattern: new RegExp(/^\d{12}$/),
                                            message: "Введите 12 цифр"
                                        }
                                    ]}
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
                                    name="sex"
                                    label="Пол"
                                    rules={[{ required: true, message: "Пол" }]}
                                >
                                    <SharedEmptySelect
                                        form={form}
                                        selectValues={sexes}
                                        propertyName={"sex"}
                                        id={"id"}
                                    />
                                    {/*<ValuesSelect*/}
                                    {/*    form={form}*/}
                                    {/*    selectValues={sexes}*/}
                                    {/*    propertyName={"sex"}*/}
                                    {/*/>*/}
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
                                    <Select
                                        value={currentDivisionId}
                                        onChange={handleCurrentDivisionId}
                                        allowClear
                                    >
                                        {(divisions || []).map((el, i) => (
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
                                        {(positions || []).map((el, i) => (
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

export default UserAddDrawer;
