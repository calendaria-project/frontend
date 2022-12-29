import { Col, Image, Row, Empty } from "antd";
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

import { IBirthStatItemWithPhotoModel } from "interfaces/extended";

interface IBirthdayInfoCard {
    statItemsLoading: boolean;
    statItemsWithPhotoId: IBirthStatItemWithPhotoModel[];
}

const BirthdayInfoCard: FC<IBirthdayInfoCard> = ({ statItemsLoading, statItemsWithPhotoId }) => {
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
            {statItemsLoading ? (
                <div className={classes.birthdayImageCenteredWrap}>
                    <Spinner size={40} style={{ color: theme.color.regular + "" }} />
                </div>
            ) : statItemsWithPhotoId.length ? (
                sortArrayWithBirthDates(statItemsWithPhotoId).map((statItem, index) => (
                    <Row
                        key={statItem.birthDate + index}
                        className={classes.birthdayContentWrapper}
                        align={"middle"}
                    >
                        <Col>
                            {statItem.currentPhotoId ? (
                                <Image
                                    className={classes.birthUsersImage}
                                    width={40}
                                    height={40}
                                    src={statItem.currentPhotoId}
                                />
                            ) : (
                                <QuestionCircleOutlined className={classes.questionIcon} />
                            )}
                        </Col>
                        <Col className={classes.birthdayContentInfo}>
                            <div>
                                {getFullName(
                                    statItem.firstname,
                                    statItem.lastname,
                                    statItem.patronymic
                                )}
                            </div>
                            <div>
                                {dateToYMD(new Date()) ===
                                dateToYMD(new Date(statItem.birthDate)) ? (
                                    <span className={classes.highlightedBirthDate}>Сегодня</span>
                                ) : (
                                    <span className={classes.birthDate}>
                                        {localeDate(statItem.birthDate, "ru")}
                                    </span>
                                )}
                            </div>
                        </Col>
                    </Row>
                ))
            ) : (
                <div className={classes.birthdayImageCenteredWrap}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            )}
        </>
    );
};
export default memo(BirthdayInfoCard);
