import React, { FC, memo } from "react";
import { IAccessAppDataByCurrentUserInKeyViewModel } from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { Row, Col, Typography, Checkbox } from "antd";
import getFullName from "utils/getFullName";
import diffDateAndToString from "utils/diffDateAndToString";
import { getFormattedDateFromNowWithTime } from "utils/getFormattedDates";

interface IReqCard {
    reqData: IAccessAppDataByCurrentUserInKeyViewModel;
}

const { Text } = Typography;

const ReqCard: FC<IReqCard> = ({ reqData }) => {
    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    const creatorUserData = reqData.creatorUser;
    const applicationUserData = reqData.applicationUser;
    const creationTime = reqData.createdAt;
    const editionTime = reqData.updatedAt;

    return (
        <Row className={classes.container}>
            <Row align={"middle"} className={classes.titleContainer}>
                <Text className={classes.title}>Заявка #{reqData.applicationId}</Text>
            </Row>
            <Row className={classes.contentContainer}>
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
                                new Date(reqData.endDate),
                                "Время истекло"
                            )}
                        </span>
                    </Col>
                    <Col className={classes.creatorInfoLastCol} span={24}>
                        <Text className={classes.describeTitle}>Описание заявки</Text>
                    </Col>
                </Row>
                <Row className={classes.aboutReqContainer}>
                    {(reqData.items || []).map((item, index) => (
                        <Row
                            key={"_" + item.accessType?.code + index}
                            className={classes.aboutReqItemContainer}
                        >
                            <Checkbox
                                className={classes.aboutReqItemCheckbox}
                                disabled
                                checked={item.needAccess}
                            >
                                {item.appItemType?.nameRu}
                            </Checkbox>
                            <Text className={classes.aboutReqItemStatus}>
                                {item.accessType?.nameRu ?? item.tariff?.nameRu ?? ""}
                            </Text>
                        </Row>
                    ))}
                </Row>
            </Row>
        </Row>
    );
};
export default memo(ReqCard);
