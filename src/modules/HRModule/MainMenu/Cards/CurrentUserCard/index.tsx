import { Col, Row } from "antd";
import Spinner from "ui/Spinner";
import { QuestionCircleOutlined } from "@ant-design/icons";
import getFullName from "utils/getFullName";
import getYearsAmount from "utils/getYearsAmount";
import React, { FC, memo } from "react";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { IUsersViewModel } from "interfaces";

interface ICurrentUserCard {
    photoLoading: boolean;
    currentUserPhoto: string | null;
    currentUser: IUsersViewModel;
}

const CurrentUserCard: FC<ICurrentUserCard> = ({ photoLoading, currentUserPhoto, currentUser }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    return (
        <>
            <Row align={"middle"}>
                <Col className={classes.photoCol}>
                    {photoLoading ? (
                        <Spinner size={20} style={{ color: "white" }} />
                    ) : currentUserPhoto ? (
                        <img
                            alt={"user photo"}
                            src={currentUserPhoto}
                            width={"40px"}
                            height={"40px"}
                            style={{ borderRadius: "50%" }}
                        />
                    ) : (
                        <QuestionCircleOutlined className={classes.questionIcon} />
                    )}
                </Col>
                <Col className={classes.fullNameWrapper}>
                    {getFullName(
                        currentUser.firstname,
                        currentUser.lastname,
                        currentUser.patronymic
                    )}
                </Col>
            </Row>
            <Row align={"middle"}>
                <Col className={classes.userInfoName}>Должность:</Col>
                <Col className={classes.userInfoValue}>{currentUser.position?.nameRu ?? ""}</Col>
            </Row>
            <Row align={"middle"}>
                <Col className={classes.userInfoName}>Возраст:</Col>
                <Col className={classes.userInfoValue}>
                    {currentUser.birthDate ? getYearsAmount(currentUser.birthDate) : ""}
                </Col>
            </Row>
            <Row align={"middle"}>
                <Col className={classes.userInfoName}>Номер:</Col>
                <Col className={classes.userInfoValue}>
                    {currentUser.personalContact?.mobilePhoneNumber ?? ""}
                </Col>
            </Row>
            <Row align={"middle"}>
                <Col className={classes.userInfoName}>Почта:</Col>
                <Col className={classes.userInfoValue}>
                    {currentUser.personalContact?.email ?? ""}
                </Col>
            </Row>
        </>
    );
};
export default memo(CurrentUserCard);
