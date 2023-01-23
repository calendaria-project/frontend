import React, { FC, memo, useCallback, useEffect, useState, Suspense } from "react";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel
} from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { Row, Col, Typography, Checkbox } from "antd";
import getFullName from "utils/getFullName";
import diffDateAndToString from "utils/diffDateAndToString";
import { getFormattedDateFromNowWithTime } from "utils/getFormattedDates";
import { getReqBallStyle } from "utils/getReqBallStyle";
import { accessItemRequestTranscripts } from "data/transcripts";
import { ITheme } from "styles/theme/interface";
import Button from "ui/Button";
import getReqDataForUpdate from "utils/getReqDataForUpdate";
import { accessRequestStatuses } from "data/enums";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";

interface IReqCard {
    reqData: IAccessAppDataByCurrentUserViewModel;
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
    updateReqData: (data: IAccessAppDataByCurrentUserViewModel) => void;
    initAppHistory: () => void;
}

const { Text } = Typography;
const SimpleConfirmationModal = React.lazy(
    () => import("components/Shared/modalRenderer/ReadyModals/SimpleConfirmationModal")
);

const ReqCard: FC<IReqCard> = ({ reqData, currentReqData, updateReqData, initAppHistory }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const [reqSolved, setReqSolved] = useState(false);
    const [solveModalVisible, setSolveModalVisible] = useState(false);

    const { doAccessApplicationTaskById } = useSimpleHttpFunctions();

    useEffect(() => {
        setReqSolved(false);
    }, [currentReqData]);

    const handleSolveReq = useCallback(async () => {
        const applicationId = currentReqData.applicationId;
        await doAccessApplicationTaskById(applicationId).catch((e) => console.log(e));

        const dataForUpdate = getReqDataForUpdate(
            reqData,
            currentReqData,
            applicationId,
            accessRequestStatuses.DONE,
            accessRequestStatuses.ON_PROCESS,
            true
        );

        updateReqData(dataForUpdate);
        initAppHistory();
        setReqSolved(true);
        setSolveModalVisible(false);
    }, [reqData, currentReqData, updateReqData, initAppHistory]);

    const getItemNameAndItemStatusWithBall = (name: string, status: string) => {
        return (
            <div className={classes.statusContainer}>
                <Text>{name}</Text>
                <div className={classes.statusDivider}>—</div>
                <div className={classes.statusBall} style={getReqBallStyle(theme, status)} />
                <Text>{accessItemRequestTranscripts[status] ?? ""}</Text>
            </div>
        );
    };

    const creatorUserData = currentReqData.creatorUser || {};
    const applicationUserData = currentReqData.applicationUser || {};
    const creationTime = currentReqData.createdAt;
    const editionTime = currentReqData.updatedAt;

    return (
        <Row className={classes.container}>
            <Row align={"middle"} justify={"space-between"} className={classes.titleContainer}>
                <Text className={classes.title}>Заявка #{currentReqData.applicationId}</Text>
                <Col className={classes.btnsCol}>
                    <div
                        style={{
                            background: reqSolved
                                ? theme.color.successful
                                : theme.color.extraText + ""
                        }}
                        className={classes.statusBtn}
                    >
                        {!reqSolved
                            ? accessItemRequestTranscripts[currentReqData.status]
                            : "Выполнено"}
                    </div>
                    {!reqSolved && (
                        <Button
                            onClick={() => setSolveModalVisible(true)}
                            className={classes.solveBtn}
                            customType={"regular"}
                        >
                            Выполнить
                        </Button>
                    )}
                </Col>
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
                                new Date(currentReqData.endDate),
                                "Время истекло"
                            )}
                        </span>
                    </Col>
                    <Col className={classes.creatorInfoLastCol} span={24}>
                        <Text className={classes.describeTitle}>Описание заявки</Text>
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
            </Row>
            <Suspense>
                <SimpleConfirmationModal
                    isVisible={solveModalVisible}
                    setIsVisible={setSolveModalVisible}
                    title={"Пожалуйста подтвердите, что вы выполнили заявку"}
                    okText={"Подтвердить"}
                    confirmAction={handleSolveReq}
                />
            </Suspense>
        </Row>
    );
};
export default memo(ReqCard);
