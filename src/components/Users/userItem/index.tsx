import React, { FC, memo, useCallback, useContext, useEffect, useState } from "react";
import { Col, Row, Typography, Button, Card, Divider, Image, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import getFullName from "utils/getFullName";

import "./styles.scss";
import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import Header from "ui/Header";
import UserExtraCard from "./userExtraCard";
import { UserDrawer, USER_EDIT_DRAWER } from "../userDrawer";

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
    const onFinishEditingUser = useCallback((data: any) => {}, []);

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
                `file/download${fileId}`,
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
                `file/download${photoId}`,
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
            <Row className="row-wrapper" align={"middle"} gutter={[32, 16]}>
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
                                <Col>
                                    {currentUserPhoto && (
                                        <Image width={60} src={currentUserPhoto} />
                                    )}
                                </Col>
                                <Col>
                                    <Title level={5}>
                                        {getFullName(
                                            currentUserData.firstname,
                                            currentUserData?.lastname,
                                            currentUserData?.patronymic
                                        )}
                                    </Title>
                                </Col>
                            </Row>
                            <Col span={24}>
                                <Text type="secondary">
                                    {currentUserData?.personalContact?.email}
                                </Text>
                            </Col>
                            <Col className="mobile-number-wrapper" span={24}>
                                <Text type="secondary">{currentUserData?.mobilePhoneNumber}</Text>
                            </Col>
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
                <UserDrawer
                    drawerType={USER_EDIT_DRAWER}
                    companyId={currentUserData?.company?.companyId}
                    open={isVisibleEditUserDrawer}
                    setOpen={setIsVisibleEditUserDrawer}
                    companyName={currentUserData?.company?.nameRu}
                    onFinishCreatingUser={onFinishEditingUser}
                />
                <Col span={16}>
                    <UserExtraCard usersId={usersId!} />
                </Col>
            </Row>
        </Row>
    );
};
export default memo(UserItem);
