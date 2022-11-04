import React, { FC, memo, useCallback, useContext, useEffect, useState } from "react";
import { Col, Row, Typography, Button, Card, Divider, Image, message, Tooltip } from "antd";
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
import Spinner from "../../../ui/Spinner";

const { Title, Text } = Typography;

const UserItem: FC = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const { usersId } = useParams();

    const [currentUserData, setCurrentUserData] = useState<any>({});
    const [currentUserSign, setCurrentUserSign] = useState<string | null>(null);
    const [currentUserPhoto, setCurrentUserPhoto] = useState<string | null>(null);

    const [photoLoading, setPhotoLoading] = useState<boolean>(false);
    const [signLoading, setSignLoading] = useState<boolean>(false);

    const [isVisibleEditUserDrawer, setIsVisibleEditUserDrawer] = useState(false);
    const onShowDrawer = useCallback(() => setIsVisibleEditUserDrawer(true), []);
    const onFinishEditingUser = useCallback(
        (data: any) => {
            setCurrentUserData(data);
        },
        [currentUserData]
    );

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
        setSignLoading(true);
        if (fileId) {
            actionMethodResultSync("FILE", `file/download/${fileId}/base64`, "get").then((res) => {
                setSignLoading(false);
                setCurrentUserSign(res);
            });
        } else {
            setSignLoading(false);
            setCurrentUserSign(null);
        }

        const photoId = currentUserData?.profilePhotoId;
        setPhotoLoading(true);
        if (photoId) {
            actionMethodResultSync("FILE", `file/download/${photoId}/base64`, "get").then((res) => {
                setPhotoLoading(false);
                setCurrentUserPhoto(res);
            });
        } else {
            setPhotoLoading(false);
            setCurrentUserPhoto(null);
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
        <Row
            className="container"
            style={{ padding: "20px", marginRight: 0, marginLeft: 0, width: "100%" }}
            gutter={[16, 16]}
        >
            <Row
                style={{ padding: "0", marginRight: 0, marginLeft: 0, width: "100%" }}
                gutter={[16, 0]}
            >
                <Col className="container-backText" onClick={handleBackClick}>
                    <LeftOutlined /> Вернуться назад
                </Col>
            </Row>
            <Row
                style={{
                    marginRight: "8px",
                    marginLeft: "8px",
                    width: "100%",
                    borderBottom: "1px solid #C2C2C2"
                }}
                align={"middle"}
                gutter={[16, 16]}
            >
                <Col style={{ padding: "0 8px 0 0" }}>
                    <Header size="h2">{currentUserData?.company?.nameRu}</Header>
                </Col>
                <Col>Подразделение: {currentUserData?.division?.nameRu}</Col>
                <Col>Должность: {currentUserData?.position?.nameRu}</Col>
                <Col style={{ padding: 0 }} className="col-end-wrapper">
                    <Button onClick={handleDeleteBtnClick} className="delete-btn">
                        Удалить сотрудника
                    </Button>
                </Col>
            </Row>
            <Row
                className="row-wrapper"
                style={{ marginRight: 0, marginLeft: 0, width: "100%" }}
                gutter={[16, 16]}
            >
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
                                        {photoLoading ? (
                                            <Spinner size={20} />
                                        ) : currentUserPhoto ? (
                                            <Image
                                                className="user-image"
                                                width={100}
                                                height={100}
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
                                <Tooltip title={"ИИН"}>
                                    <Text>{currentUserData?.iin}</Text>
                                </Tooltip>
                                <Divider className={"userItem__mainCard-divider"} />
                            </Col>
                            <Col span={24}>
                                <Tooltip title={"Дата рождения"}>
                                    <Text>{currentUserData?.birthDate}</Text>
                                </Tooltip>
                                <Divider className={"userItem__mainCard-divider"} />
                            </Col>
                            <Col span={24}>
                                <Tooltip title={"Пол"}>
                                    <Text>{currentUserData?.sex?.nameRu}</Text>
                                </Tooltip>
                                <Divider className={"userItem__mainCard-divider"} />
                            </Col>
                            <Col span={24}>
                                <Tooltip title={"Дата приема на работу"}>
                                    <Text>{currentUserData?.employmentDate}</Text>
                                </Tooltip>
                                <Divider className={"userItem__mainCard-divider"} />
                            </Col>
                            <Row className="row-wrapper" align="middle">
                                <Col>Подпись:</Col>
                                <Col className="col-end-wrapper">
                                    {signLoading ? (
                                        <Spinner size={20} />
                                    ) : currentUserSign ? (
                                        <Image width={40} src={currentUserSign} />
                                    ) : null}
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
