import React, { FC, memo, useCallback, useContext, useEffect, useState, Suspense } from "react";
import { Col, Row, Typography, Card, Divider, Image, message, Tooltip } from "antd";
import cx from "classnames";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import getFullName from "utils/getFullName";

import Button from "ui/Button";

import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import Header from "ui/Header";
import UserExtraCard from "./userExtraCard";
import Spinner from "ui/Spinner";
import { SetCurrentOpenedMenu, SetCurrentUserFio } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";

const { Title, Text } = Typography;

import { IUsersViewModel } from "interfaces";
import { ARCHIVE } from "data/constants";

const UserEditDrawer = React.lazy(() => import("../userDrawer/UserEditDrawer"));
const UserItemArchiveModal = React.lazy(
    () => import("components/Shared/modalRenderer/ReadyModals/SimpleConfirmationModal")
);

const UserItem: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const { usersId } = useParams();

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.userItem));
    }, []);

    const [currentUserData, setCurrentUserData] = useState<IUsersViewModel>({} as IUsersViewModel);
    // const [currentUserSign, setCurrentUserSign] = useState<string | null>(null);
    const [currentUserPhoto, setCurrentUserPhoto] = useState<string | null>(null);

    const [photoLoading, setPhotoLoading] = useState<boolean>(false);
    // const [signLoading, setSignLoading] = useState<boolean>(false);

    const [archiveModalVisible, setArchiveModalVisible] = useState<boolean>(false);
    const handleArchiveModalVisible = useCallback(() => setArchiveModalVisible(true), []);

    const [isVisibleEditUserDrawer, setIsVisibleEditUserDrawer] = useState(false);
    const onShowDrawer = useCallback(() => setIsVisibleEditUserDrawer(true), []);
    const onFinishEditingUser = (data: any) => {
        setCurrentUserData(data);
    };

    const userFio = getFullName(
        currentUserData.firstname,
        currentUserData?.lastname,
        currentUserData?.patronymic
    );
    useEffect(() => {
        if (userFio) {
            dispatch(SetCurrentUserFio(userFio));
        }
    }, [userFio]);

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
        // const fileId = currentUserData?.signFileId;
        // setSignLoading(true);
        // if (fileId) {
        //     actionMethodResultSync("FILE", `file/download/${fileId}/base64`, "get").then((res) => {
        //         setSignLoading(false);
        //         setCurrentUserSign(res);
        //     });
        // } else {
        //     setSignLoading(false);
        //     setCurrentUserSign(null);
        // }
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

    const handleDeleteUser = useCallback(() => {
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
        <Row className={classes.container} gutter={[16, 16]}>
            <Row className={classes.infoRowWrapper} align={"middle"} gutter={[16, 16]}>
                <Col className={classes.headerCol}>
                    <Header size="h2">{currentUserData?.company?.nameRu}</Header>
                </Col>
                <Col className={classes.divisionCol}>
                    <span className={classes.extraInfoSpan}>Подразделение: </span>
                    {currentUserData?.division?.nameRu}
                </Col>
                <Col className={classes.positionCol}>
                    <span className={classes.extraInfoSpan}>Должность: </span>
                    {currentUserData?.position?.nameRu}
                </Col>
                {sessionStorage.getItem("userReqType") !== ARCHIVE && (
                    <Col className={cx(classes.archiveCol, classes.endedCol)}>
                        <Button onClick={handleArchiveModalVisible} customType={"removing"}>
                            В архив
                        </Button>
                    </Col>
                )}
            </Row>
            <Row className={classes.rowWrapper} gutter={[16, 16]}>
                <Col className={classes.mainCardCol} span={8}>
                    <Card
                        className={classes.mainCard}
                        title="Основная информация"
                        extra={
                            <Button onClick={onShowDrawer} customType={"regular"}>
                                Изменить
                            </Button>
                        }
                    >
                        <Row className={classes.rowWrapper}>
                            <Row align={"middle"} className={classes.rowWrapper}>
                                <Col span={10}>
                                    <div className={classes.imageWrapper}>
                                        {photoLoading ? (
                                            <Spinner size={20} />
                                        ) : currentUserPhoto ? (
                                            <Image
                                                className={classes.userImage}
                                                width={100}
                                                height={100}
                                                src={currentUserPhoto}
                                            />
                                        ) : (
                                            <QuestionCircleOutlined />
                                        )}
                                    </div>
                                </Col>
                                <Col span={14} className={classes.fioWrapper}>
                                    <Title level={5}>{userFio}</Title>
                                    <Text type="secondary">
                                        {currentUserData?.personalContact?.mobilePhoneNumber ?? ""}
                                    </Text>
                                    <br />
                                    <Text type="secondary">
                                        {currentUserData?.personalContact?.email ?? ""}
                                    </Text>
                                </Col>
                            </Row>
                            <Col span={24}>
                                <Divider />
                                <Tooltip title={"ИИН"}>
                                    <Text>{currentUserData?.iin ?? ""}</Text>
                                </Tooltip>
                                <Divider />
                            </Col>
                            <Col span={24}>
                                <Tooltip title={"Дата рождения"}>
                                    <Text>{currentUserData?.birthDate ?? ""}</Text>
                                </Tooltip>
                                <Divider />
                            </Col>
                            <Col span={24}>
                                <Tooltip title={"Пол"}>
                                    <Text>{currentUserData?.sex?.nameRu ?? ""}</Text>
                                </Tooltip>
                                <Divider />
                            </Col>
                            <Col span={24}>
                                <Tooltip title={"Дата приема на работу"}>
                                    <Text>{currentUserData?.employmentDate ?? ""}</Text>
                                </Tooltip>
                                {/*<Divider />*/}
                            </Col>
                            {/*<Row className={classes.rowWrapper} align="middle">*/}
                            {/*    <Col>Подпись:</Col>*/}
                            {/*    <Col className={classes.endedCol}>*/}
                            {/*        {signLoading ? (*/}
                            {/*            <Spinner size={20} />*/}
                            {/*        ) : currentUserSign ? (*/}
                            {/*            <Image width={40} src={currentUserSign} />*/}
                            {/*        ) : null}*/}
                            {/*    </Col>*/}
                            {/*</Row>*/}
                        </Row>
                    </Card>
                </Col>
                <Suspense>
                    <UserEditDrawer
                        userPhoto={currentUserPhoto}
                        // userSign={currentUserSign}
                        userData={currentUserData}
                        divisionId={currentUserData.divisionId}
                        companyId={currentUserData.company?.companyId}
                        open={isVisibleEditUserDrawer}
                        setOpen={setIsVisibleEditUserDrawer}
                        companyName={currentUserData?.company?.nameRu}
                        onFinishEditingUser={onFinishEditingUser}
                    />
                </Suspense>
                <Suspense>
                    <UserItemArchiveModal
                        okText={"Удалить"}
                        title={"Вы уверены что хотите перенести в архив текущего сотрудника?"}
                        isVisible={archiveModalVisible}
                        setIsVisible={setArchiveModalVisible}
                        confirmAction={handleDeleteUser}
                    />
                </Suspense>
                <Col className={classes.extraCardCol} span={16}>
                    <UserExtraCard usersId={usersId!} />
                </Col>
            </Row>
        </Row>
    );
};
export default memo(UserItem);
