import { FC, useState } from "react";
import { Col, Row, Typography, Button, Card } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { usersCardData } from "../defaultData";
import { IUsersCardModel } from "interfaces";

import "./styles.scss";

const UserItem: FC = () => {
    const navigate = useNavigate();
    const { usersId } = useParams();

    const { Title, Text } = Typography;

    const [currentUserParams] = useState<IUsersCardModel>(
        Object.assign({}, ...usersCardData.filter((dataItem) => dataItem.id + "" === usersId + ""))
    );

    const handleBackClick = () => navigate("/users");

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
                        className={"userItem__userCard"}
                        size="small"
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
                            <Col span={24}>
                                <Text type="secondary">{currentUserParams.phone}</Text>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={14}>Остальное</Col>
            </Row>
        </Row>
    );
};
export default UserItem;
