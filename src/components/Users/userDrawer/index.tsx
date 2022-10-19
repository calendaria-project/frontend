import { DownOutlined, LeftOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
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
import { getRequestHeader, postFormDataHeader } from "functions/common";
import { IDivisionDtoModel, IPositionDtoModel, ISimpleDictionaryModel } from "interfaces";
import { useContext, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
const { Option } = Select;
const { Title } = Typography;

const getBase64 = (img: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

export interface IUserAddDrawer {
    drawerType: string;
    companyId: string | undefined;
    companyName: string | undefined;
    open: boolean;
    setOpen: (val: boolean) => void;
    onFinishCreatingUser: (data: any) => void;
}

export const USER_ADD_DRAWER = "add";
export const USER_EDIT_DRAWER = "edit";

export const UserDrawer = ({
    drawerType,
    open,
    setOpen,
    companyName,
    onFinishCreatingUser,
    companyId
}: IUserAddDrawer) => {
    const [form] = Form.useForm();
    const authContext = useContext(AuthContext);
    const [divisions, setDivisions] = useState<IDivisionDtoModel[]>([]);
    const [positions, setPositions] = useState<IPositionDtoModel[]>([]);
    const [sexes, setSexes] = useState<ISimpleDictionaryModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>();
    const [signFileName, setSignFileName] = useState<string>();

    useEffect(() => {
        getPositionOptions();
        getSexOptions();
    }, []);

    useEffect(() => {
        if (companyId && divisions.length === 0) {
            getDivisionOptions();
        }
    }, [companyId]);

    const getDivisionOptions = () => {
        return actionMethodResultSync(
            "DICTIONARY",
            `division?companyId=${companyId}&page=0&size=1000&sortingRule=divisionId%3AASC`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => setDivisions(data.content));
    };

    const getPositionOptions = () => {
        return actionMethodResultSync(
            "DICTIONARY",
            `position?page=0&size=1000&sortingRule=positionId%3AASC`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => setPositions(data.content));
    };

    const getSexOptions = () => {
        return actionMethodResultSync(
            "DICTIONARY",
            `simple/SEX`,
            "get",
            getRequestHeader(authContext.token)
        ).then(setSexes);
    };

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const uploadButton = (
        <div className="avatarWrap">
            {loading ? <LoadingOutlined /> : <PlusOutlined color="#fff" />}
        </div>
    );

    const onFinish = (values: any) => {
        console.log({ values });
    };

    const parsePointObjectKey = (data: any) => {
        let parsedData: any = {};
        for (let key in data) {
            if (key.includes(".")) {
                let arrData = key.split(".");
                parsedData[arrData[0]] = {
                    [arrData[1]]: data[key]
                };
            } else if (key.includes("Date")) {
                parsedData[key] = data[key].format("YYYY-MM-DD");
            } else {
                parsedData[key] = data[key];
            }
        }
        parsedData.company = { companyId };
        return parsedData;
    };

    const handleCreateUser = () => {
        form.validateFields().then((e) => {
            let data = parsePointObjectKey(e);
            createUser(data);
        });
    };

    const createUser = (data: any) => {
        actionMethodResultSync(
            "USER",
            "user",
            "post",
            getRequestHeader(authContext.token),
            data
        ).then((data) => {
            message.success("Успешно создано");
            onClose();
            onFinishCreatingUser(data);
        });
    };

    const uploadAvatarFile = (acceptedFiles: File[]) => {
        const fData = new FormData();
        fData.append("file", acceptedFiles[0]);
        setLoading(true);
        getBase64(acceptedFiles[0], (url) => {
            setLoading(false);
            setAvatarUrl(url);
        });
        actionMethodResultSync(
            "FILE",
            "file/uplaod",
            "post",
            postFormDataHeader(authContext.token)
        ).then((res) => {
            form.setFieldValue("profilePhotoId", res.id);
            getBase64(acceptedFiles[0], (url) => {
                setLoading(false);
                setAvatarUrl(url);
            });
        });
    };

    const uploadSignFile = (acceptedFiles: File[]) => {
        const fData = new FormData();
        fData.append("file", acceptedFiles[0]);
        actionMethodResultSync(
            "FILE",
            "file/uplaod",
            "post",
            postFormDataHeader(authContext.token)
        ).then((res) => {
            form.setFieldValue("signFileId", res.id);
            setSignFileName(acceptedFiles[0].name);
        });
    };

    const deleteAvatar = () => {
        setAvatarUrl(undefined);
        form.setFieldValue("profilePhotoId", undefined);
    };

    const deleteSignFile = () => {
        setSignFileName(undefined);
        form.setFieldValue("signFileId", undefined);
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
                    <Button onClick={onClose}>Отменить</Button>
                    <Button onClick={handleCreateUser} type="primary">
                        Сохранить
                    </Button>
                </Space>
            }
        >
            <Form form={form} onFinish={onFinish} layout="vertical" className="addUserFormWrap">
                <Row gutter={24} className="infoTitleRow">
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
                        <Space className="addUserTitleSpace" direction="vertical" align="center">
                            <Title level={3}>Основная информация</Title>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="avatar" style={{ width: "100%" }} />
                            ) : (
                                uploadButton
                            )}
                            <Dropzone
                                accept={"image/jpeg, image/png"}
                                onDrop={uploadAvatarFile}
                                maxSize={20000000000}
                            >
                                {({ getRootProps, getInputProps }) => {
                                    return (
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <Button color="green" className="uplaodBtn" type="text">
                                                Добавить
                                            </Button>
                                        </div>
                                    );
                                }}
                            </Dropzone>
                            <Button
                                onClick={deleteAvatar}
                                className="deleteBtn"
                                color="red"
                                type="text"
                            >
                                Удалить
                            </Button>
                        </Space>
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
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name="personalContact.email" label="Почта">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="personalContact.mobilePhoneNumber"
                                    rules={[{ required: true, message: "Номер" }]}
                                    label="Номер"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item
                                    name="birthDate"
                                    label="Дата рождения"
                                    rules={[{ required: true, message: "Дата рождения" }]}
                                >
                                    <DatePicker style={{ width: "100%" }} />
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
                            <Col span={16}>
                                <Form.Item
                                    name="employmentDate"
                                    label="Дата приема на работу"
                                    rules={[{ required: true, message: "Дата приема на работу" }]}
                                >
                                    <DatePicker style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    // noStyle
                                    className="uploadItem"
                                    label="Подпись"
                                    shouldUpdate={() => signFileName !== undefined}
                                >
                                    <Input readOnly value={signFileName} />
                                    {!signFileName ? (
                                        <Dropzone
                                            accept={"image/jpeg, image/png"}
                                            onDrop={uploadSignFile}
                                            maxSize={20000000000}
                                        >
                                            {({ getRootProps, getInputProps }) => {
                                                return (
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <Button className="uplaodBtn" type="text">
                                                            Загрузить
                                                        </Button>
                                                    </div>
                                                );
                                            }}
                                        </Dropzone>
                                    ) : (
                                        <Button
                                            className="deleteBtn"
                                            onClick={deleteSignFile}
                                            type="text"
                                        >
                                            Удалить
                                        </Button>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={24} className="infoTitleRow">
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
                        <Space className="addUserTitleSpace" direction="vertical" align="center">
                            <Title level={3}>Информация о компании</Title>
                            <div className="avatarWrap">
                                <PlusOutlined color="#fff" />
                            </div>
                            <Button className="uplaodBtn" color="red" type="text">
                                Добавить
                            </Button>
                            <Button className="deleteBtn" color="red" type="text">
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
