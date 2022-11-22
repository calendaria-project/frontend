import { Col, Image, Row } from "antd";
import BirthIcon from "assets/svgComponents/BirthIcon";
import Spinner from "ui/Spinner";
import sortArrayWithBirthDates, { dateToYMD } from "utils/sortArrayWithBirthDates";
import { QuestionCircleOutlined } from "@ant-design/icons";
import getFullName from "utils/getFullName";
import localeDate from "utils/localeDate";
import React, { FC, memo } from "react";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";

import { IUsersWithPhotoId } from "../../index";

interface IBirthdayInfoCard {
    usersWithPhotoIdLoading: boolean;
    usersWithPhotoId: IUsersWithPhotoId[];
}

const BirthdayInfoCard: FC<IBirthdayInfoCard> = ({ usersWithPhotoIdLoading, usersWithPhotoId }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    return (
        <>
            <Row align={"middle"}>
                <Col>
                    <BirthIcon color={theme.image.color.regular + ""} />
                </Col>
                <Col className={classes.birthdayTitle}>Дни рождения</Col>
            </Row>
            {usersWithPhotoIdLoading ? (
                <div className={classes.birthdayImageSpinWrap}>
                    <Spinner size={40} style={{ color: theme.color.regular + "" }} />
                </div>
            ) : usersWithPhotoId ? (
                sortArrayWithBirthDates(usersWithPhotoId).map((userItem, index) => (
                    <Row className={classes.birthdayContentWrapper} align={"middle"}>
                        <Col>
                            {userItem.currentUserPhotoId ? (
                                <Image
                                    className={classes.birthUsersImage}
                                    width={40}
                                    height={40}
                                    src={userItem.currentUserPhotoId}
                                />
                            ) : (
                                <QuestionCircleOutlined className={classes.questionIcon} />
                            )}
                        </Col>
                        <Col className={classes.birthdayContentInfo}>
                            <div>
                                {getFullName(
                                    userItem.firstname,
                                    userItem.lastname,
                                    userItem.patronymic
                                )}
                            </div>
                            <div>
                                {index === 0 &&
                                dateToYMD(new Date()) ===
                                    dateToYMD(new Date(userItem.birthDate)) ? (
                                    <span className={classes.highlightedBirthDate}>
                                        {localeDate(userItem.birthDate, "ru")}
                                    </span>
                                ) : (
                                    <span className={classes.birthDate}>
                                        {localeDate(userItem.birthDate, "ru")}
                                    </span>
                                )}
                            </div>
                        </Col>
                    </Row>
                ))
            ) : null}
        </>
    );
};
export default memo(BirthdayInfoCard);
