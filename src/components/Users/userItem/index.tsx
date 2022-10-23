import React, { FC, memo, useCallback, useContext, useEffect, useState } from "react";
import { Col, Row, Typography, Button, Card, Divider, Image, message } from "antd";
import { LeftOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import getFullName from "utils/getFullName";

import "./styles.scss";
import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import Header from "ui/Header";
import UserExtraCard from "./userExtraCard";
import { UserEditDrawer } from "../userDrawer/UserEditDrawer";

const { Title, Text } = Typography;

const UserItem: FC = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const { usersId } = useParams();

    const [currentUserData, setCurrentUserData] = useState<any>({});
    const [currentUserSign, setCurrentUserSign] = useState<string>("");
    const [currentUserPhoto, setCurrentUserPhoto] = useState<string>("");

    const [isVisibleEditUserDrawer, setIsVisibleEditUserDrawer] = useState(false);
    const onShowDrawer = useCallback(() => setIsVisibleEditUserDrawer(true), []);
    const onFinishEditingUser = useCallback(
        (data: any) => setCurrentUserData(data),
        [currentUserData]
    );

    console.log("USER ITEM", currentUserData);

    useEffect(() => {
        actionMethodResultSync(
            "USER",
            `user/${usersId!}`,
            "get",
            getRequestHeader(authContext.token)
        ).then((res) => {
            setCurrentUserData(res);
        });
    }, [usersId]);

    useEffect(() => {
        const fileId = currentUserData?.signFileId;
        if (fileId) {
            actionMethodResultSync(
                "FILE",
                `file/download/${fileId}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((res) => {
                setCurrentUserSign(res);
            });
        }
        const photoId = currentUserData?.profilePhotoId;
        if (photoId) {
            actionMethodResultSync(
                "FILE",
                `file/download/${photoId}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((res) => {
                setCurrentUserPhoto(res);
            });
        }
    }, [currentUserData]);

    const handleBackClick = () => navigate("/users");

    const handleDeleteBtnClick = useCallback(() => {
        actionMethodResultSync(
            "USER",
            `user/delete/${usersId}`,
            "delete",
            getRequestHeader(authContext.token)
        )
            .then((data) => {
                message.success("Успешно удалено");
                navigate("/users");
                return data;
            })
            .catch(() => {
                message.error("Ошибка");
                return {};
            });
    }, [usersId]);

    return (
        <Row className="container" gutter={[16, 16]}>
            <Row style={{ marginRight: 0, marginLeft: 0, width: "100%" }} gutter={[16, 16]}>
                <Col className="container-backText" onClick={handleBackClick}>
                    <LeftOutlined /> Вернуться назад
                </Col>
            </Row>
            <Row className="row-wrapper user-item-line-row" align={"middle"} gutter={[32, 16]}>
                <Col>
                    <Header size="h2">{currentUserData?.company?.nameRu}</Header>
                </Col>
                <Col>Подразделение: {currentUserData?.division?.nameRu}</Col>
                <Col>Должность: {currentUserData?.position?.nameRu}</Col>
                <Col className="col-end-wrapper">
                    <Button onClick={handleDeleteBtnClick} className="delete-btn">
                        Удалить сотрудника
                    </Button>
                </Col>
            </Row>
            <Row className="row-wrapper" gutter={[16, 16]}>
                <Col span={8}>
                    <Card
                        className={"userItem__mainCard"}
                        title="Основная информация"
                        extra={
                            <Button
                                onClick={onShowDrawer}
                                size={"small"}
                                className="userItem__mainCard-btn"
                            >
                                Изменить
                            </Button>
                        }
                    >
                        <Row className="row-wrapper">
                            <Row align={"middle"} className="row-wrapper">
                                <Col span={10}>
                                    <div className="image-wrapper">
                                        {currentUserPhoto ? (
                                            <Image
                                                className="user-image"
                                                width={100}
                                                src={currentUserPhoto}
                                            />
                                        ) : (
                                            <QuestionCircleOutlined />
                                        )}
                                    </div>
                                </Col>
                                <Col span={14} className="fio-wrapper">
                                    <Title level={5}>
                                        {getFullName(
                                            currentUserData.firstname,
                                            currentUserData?.lastname,
                                            currentUserData?.patronymic
                                        )}
                                    </Title>
                                    <Text type="secondary">
                                        {currentUserData?.personalContact?.mobilePhoneNumber}
                                    </Text>
                                    <br />
                                    <Text type="secondary">
                                        {currentUserData?.personalContact?.email}
                                    </Text>
                                </Col>
                            </Row>
                            <Col span={24}>
                                <Divider className={"userItem__mainCard-divider"} />
                                <Text>ИИН</Text>
                                <Divider className={"userItem__mainCard-divider"} />
                            </Col>
                            <Col span={24}>
                                <Text>{currentUserData?.iin}</Text>
                                <Divider className={"userItem__mainCard-divider"} />
                            </Col>
                            <Col span={24}>
                                <Text>{currentUserData?.birthDate}</Text>
                                <Divider className={"userItem__mainCard-divider"} />
                            </Col>
                            <Col span={24}>
                                <Text>{currentUserData?.sex?.nameRu}</Text>
                                <Divider className={"userItem__mainCard-divider"} />
                            </Col>
                            <Col span={24}>
                                <Text>{currentUserData?.employmentDate}</Text>
                                <Divider className={"userItem__mainCard-divider"} />
                            </Col>
                            <Row className="row-wrapper" align="middle">
                                <Col>Подпись:</Col>
                                <Col className="col-end-wrapper">
                                    {currentUserSign && <Image width={40} src={currentUserSign} />}
                                </Col>
                            </Row>
                        </Row>
                    </Card>
                </Col>
                <UserEditDrawer
                    userPhoto={currentUserPhoto}
                    userSign={currentUserSign}
                    userData={currentUserData}
                    companyId={currentUserData?.company?.companyId}
                    open={isVisibleEditUserDrawer}
                    setOpen={setIsVisibleEditUserDrawer}
                    companyName={currentUserData?.company?.nameRu}
                    onFinishEditingUser={onFinishEditingUser}
                />
                <Col span={16}>
                    <UserExtraCard usersId={usersId!} />
                </Col>
            </Row>
        </Row>
    );
};
export default memo(UserItem);
