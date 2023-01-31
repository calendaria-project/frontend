import { Checkbox, Col, Row, Typography } from "antd";
import getFullName from "utils/getFullName";
import { getFormattedDateFromNowWithTime } from "utils/getFormattedDates";
import diffDateAndToString from "utils/diffDateAndToString";
import React, { FC, memo } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { IAccessAppDataByCurrentUserInKeyViewModel } from "interfaces";
import { accessItemRequestStatuses } from "data/enums";
import { getReqBallStyle } from "utils/getReqBallStyle";
import { accessItemRequestTranscripts } from "data/transcripts";
import { ITheme } from "styles/theme/interface";

const { Text } = Typography;

const ReqCardSharedContent: FC<{ currentReqData: IAccessAppDataByCurrentUserInKeyViewModel }> = ({
    currentReqData
}) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const getItemNameAndItemStatusWithBall = (name: string, status: string) => (
        <div className={classes.statusContainer}>
            <Text>{name}</Text>
            {status !== accessItemRequestStatuses.CANCELED ? (
                <>
                    <div className={classes.statusDivider}>—</div>
                    <div className={classes.statusBall} style={getReqBallStyle(theme, status)} />
                    <Text>{accessItemRequestTranscripts[status] ?? ""}</Text>
                </>
            ) : null}
        </div>
    );

    const creatorUserData = currentReqData.creatorUser || {};
    const applicationUserData = currentReqData.applicationUser || {};
    const creationTime = currentReqData.createdAt;
    const editionTime = currentReqData.updatedAt;

    return (
        <>
            <Row className={classes.creatorContainer}>
                <Col className={classes.creatorInfoCol} span={24}>
                    <Text strong>Автор заявки: </Text>
                    {getFullName(
                        creatorUserData.firstname,
                        creatorUserData.lastname,
                        creatorUserData.patronymic
                    )}
                </Col>
                <Col className={classes.creatorInfoCol} span={24}>
                    <Text strong>На кого создана: </Text>
                    {getFullName(
                        applicationUserData.firstname,
                        applicationUserData.lastname,
                        applicationUserData.patronymic
                    )}
                </Col>
                <Col className={classes.creatorInfoCol} span={24}>
                    <Text strong>Заявка подана: </Text>
                    {getFormattedDateFromNowWithTime(creationTime)}
                </Col>
                {editionTime && (
                    <Col span={24}>
                        <Text strong>Дата последнего изменения: </Text>
                        {getFormattedDateFromNowWithTime(editionTime)}
                    </Col>
                )}
                <Col className={classes.creatorInfoCol} span={24}>
                    <Text strong>Осталось до выполнения: </Text>
                    <span className={classes.highlightedTime}>
                        {diffDateAndToString(
                            new Date(),
                            new Date(currentReqData.endDate),
                            "Время истекло"
                        )}
                    </span>
                </Col>
                <Col className={classes.titleCol} span={24}>
                    <Text className={classes.titleText}>Описание заявки</Text>
                </Col>
            </Row>
            <Row className={classes.aboutReqContainer}>
                {(currentReqData.items || []).map((item, index) => (
                    <Row
                        key={"_" + item.accessType?.code + index}
                        className={classes.aboutReqItemContainer}
                    >
                        <Checkbox
                            className={classes.aboutReqItemCheckbox}
                            disabled
                            checked={item.needAccess}
                        >
                            {getItemNameAndItemStatusWithBall(
                                item.appItemType?.nameRu,
                                item.status
                            )}
                        </Checkbox>
                        <Text className={classes.aboutReqItemStatus}>
                            {item.accessType?.nameRu ?? item.tariff?.nameRu ?? ""}
                        </Text>
                    </Row>
                ))}
            </Row>
        </>
    );
};
export default memo(ReqCardSharedContent);
