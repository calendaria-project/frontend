import React, { FC, memo, useEffect, useState } from "react";
import { Col, Row, Typography } from "antd";
import getFullName from "utils/getFullName";
import { accessRequestHistoryTranscripts } from "data/transcripts";
import { accessRequestHistoryStatuses } from "data/enums";
import getLastNameWithInitials from "utils/getLastNameWithInitials";
import { getFormattedDateFromNowWithTime } from "utils/getFormattedDates";
import cx from "classnames";
import { ArrowDownOutlined } from "@ant-design/icons";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessApplicationHistoryViewModel
} from "interfaces";
import { useTheme } from "react-jss";
import useStyles from "./styles";
import { actionMethodResultSync } from "http/actionMethodResult";

const { Text } = Typography;

interface IReqExtraCardSharedContent {
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
    appHistory: IAccessApplicationHistoryViewModel[];
}

const ReqExtraCardSharedContent: FC<IReqExtraCardSharedContent> = ({
    currentReqData,
    appHistory
}) => {
    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    const comment = currentReqData.comment;
    const cancelReason = currentReqData.cancelReason;
    const creatorUser = currentReqData.creatorUser ?? {};
    const [creatorUserPhoto, setCreatorUserPhoto] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (comment) {
            const photoId = creatorUser.profilePhotoId;
            if (photoId) {
                actionMethodResultSync("FILE", `file/download/${photoId}/base64`, "get").then(
                    (res) => {
                        setCreatorUserPhoto(res);
                    }
                );
            } else {
                setCreatorUserPhoto(undefined);
            }
        }
    }, [creatorUser, comment]);

    console.log(appHistory);

    return (
        <>
            {comment && (
                <Row className={classes.sectionContainer}>
                    <Row align={"middle"} className={classes.titleContainer}>
                        Комментарии к заявке
                    </Row>
                    <Row className={classes.innerSectionContainer}>
                        <Col span={24}>
                            {creatorUserPhoto && (
                                <img
                                    className={classes.img}
                                    alt={""}
                                    src={creatorUserPhoto}
                                    width={"30px"}
                                    height={"30px"}
                                />
                            )}
                            <Text strong>
                                {getFullName(creatorUser.firstname, creatorUser.lastname)}
                            </Text>
                        </Col>
                        <Col className={classes.textCol} span={24}>
                            <Text>{comment}</Text>
                        </Col>
                    </Row>
                </Row>
            )}
            {appHistory && appHistory.length && (
                <Row className={classes.sectionContainer}>
                    <Row align={"middle"} className={classes.titleContainer}>
                        История изменений
                    </Row>
                    <Row className={classes.innerSectionContainer}>
                        {appHistory.map((histItem, index) => {
                            const histUser = histItem.user ?? {};
                            const status = histItem.status;
                            return (
                                <React.Fragment key={histItem.historyId}>
                                    <Row className={classes.histRow}>
                                        <Text strong>
                                            {accessRequestHistoryTranscripts[status]}
                                        </Text>
                                        {cancelReason &&
                                            status === accessRequestHistoryStatuses.REJECTED && (
                                                <Text>Причина: {cancelReason}</Text>
                                            )}
                                        <Text>
                                            {getLastNameWithInitials(
                                                histUser.firstname,
                                                histUser.lastname,
                                                histUser.patronymic
                                            )}
                                        </Text>
                                        <Text className={classes.extraText}>
                                            {getFormattedDateFromNowWithTime(histItem.createdAt)}
                                        </Text>
                                    </Row>
                                    {index !== appHistory.length - 1 && (
                                        <Row
                                            className={cx(classes.histRow, classes.histArrow)}
                                            justify={"center"}
                                        >
                                            <ArrowDownOutlined />
                                        </Row>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Row>
                </Row>
            )}
        </>
    );
};
export default memo(ReqExtraCardSharedContent);
