import { FC, useState } from "react";
import { Col, Row, Typography, Button, Card, Divider, Image, Menu, MenuProps } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { usersCardData } from "../defaultData";
import { IUsersCardModel } from "interfaces";

import "./styles.scss";

const { Title, Text } = Typography;

const items: MenuProps["items"] = [
    {
        key: "profile",
        label: "Учетная запись"
    },
    {
        key: "contacts",
        label: "Контакты"
    },
    {
        key: "organization",
        label: "Организация"
    },
    {
        key: "inventory",
        label: "Инвентарь"
    },
    {
        key: "documents",
        label: "Документы"
    },
    {
        key: "address",
        label: "Адрес"
    },
    {
        key: "automobile",
        label: "Автомобиль"
    },
    {
        key: "arrangements",
        label: "Договора"
    },
    {
        key: "information",
        label: "Информация"
    }
];

const UserItem: FC = () => {
    const navigate = useNavigate();
    const { usersId } = useParams();

    const [selectedKey, setSelectedKey] = useState<string>("profile");
    const [currentUserParams] = useState<IUsersCardModel>(
        Object.assign({}, ...usersCardData.filter((dataItem) => dataItem.id + "" === usersId + ""))
    );

    const handleBackClick = () => navigate("/users");

    const handleMenuClick: MenuProps["onClick"] = (e) => {
        setSelectedKey(e.key);
    };

    return (
        <Row style={{ padding: "20px", marginRight: 0, marginLeft: 0 }} gutter={[16, 16]}>
            <Row style={{ marginRight: 0, marginLeft: 0, width: "100%" }} gutter={[16, 16]}>
                <Col style={{ cursor: "pointer" }} onClick={handleBackClick}>
                    <LeftOutlined /> Вернуться назад
                </Col>
            </Row>
            <Row style={{ marginRight: 0, marginLeft: 0, width: "100%" }} gutter={[16, 16]}>
                <Col>Должность: {currentUserParams.profession}</Col>
                <Col style={{ display: "flex", flex: "1 1 auto", justifyContent: "end" }}>
                    <Button style={{ color: "#EB5757", background: "#fff" }}>
                        Удалить сотрудника
                    </Button>
                </Col>
            </Row>
            <Row style={{ marginRight: 0, marginLeft: 0, width: "100%" }} gutter={[16, 16]}>
                <Col span={10}>
                    <Card
                        className={"userItem__mainCard"}
                        title="Основная информация"
                        extra={
                            <Button
                                size={"small"}
                                style={{ color: "#2F80ED", borderRadius: "4px" }}
                            >
                                Изменить
                            </Button>
                        }
                    >
                        <Row style={{ marginRight: 0, marginLeft: 0, width: "100%" }}>
                            <Col span={24}>
                                <Title level={5}>{currentUserParams.fullName}</Title>
                            </Col>
                            <Col span={24}>
                                <Text type="secondary">{currentUserParams.email}</Text>
                            </Col>
                            <Col style={{ margin: "8px 0" }} span={24}>
                                <Text type="secondary">{currentUserParams.phone}</Text>
                            </Col>
                            <Col span={24}>
                                <Divider />
                                <Text>ИИН</Text>
                                <Divider />
                            </Col>
                            <Col span={24}>
                                <Text>{currentUserParams.iin}</Text>
                                <Divider />
                            </Col>
                            <Col span={24}>
                                <Text>{currentUserParams.birth}</Text>
                                <Divider />
                            </Col>
                            <Col span={24}>
                                <Text>
                                    {currentUserParams.gender === "female" ? "Женский" : "Мужской"}
                                </Text>
                                <Divider />
                            </Col>
                            <Col span={24}>
                                <Text>{currentUserParams.date}</Text>
                                <Divider />
                            </Col>
                            <Row
                                style={{ marginRight: 0, marginLeft: 0, width: "100%" }}
                                align="middle"
                            >
                                <Col>Подпись:</Col>
                                <Col
                                    style={{
                                        display: "flex",
                                        flex: "1 1 auto",
                                        justifyContent: "end"
                                    }}
                                >
                                    <Image width={40} src={currentUserParams.sign} />
                                </Col>
                            </Row>
                        </Row>
                    </Card>
                </Col>
                <Col span={14}>
                    <Card className={"userItem__extraCard"} title="Дополнительная информация">
                        <Row style={{ marginRight: 0, marginLeft: 0, width: "100%" }}>
                            <Col span={8}>
                                <Menu
                                    mode="inline"
                                    selectedKeys={[selectedKey]}
                                    onClick={handleMenuClick}
                                    items={items}
                                />
                            </Col>
                            <Col span={16}>info</Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Row>
    );
};
export default UserItem;
