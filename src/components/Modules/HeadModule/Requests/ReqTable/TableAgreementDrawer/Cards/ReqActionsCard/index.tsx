import React, { FC, memo, useCallback, useEffect, useState, Suspense } from "react";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel,
    IAccessApplicationHistoryViewModel
} from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { Col, Form, Row, Typography } from "antd";
import Button from "ui/Button";
import { CloseOutlined, CheckOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { actionMethodResultSync } from "functions/actionMethodResult";
import getFullName from "utils/getFullName";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import cx from "classnames";
import { getFormattedDateFromNowWithTime } from "utils/getFormattedDates";
import { accessRequestHistoryStatuses, accessRequestStatuses } from "data/enums";
import { accessRequestHistoryTranscripts } from "data/transcripts";
import getReqDataForUpdate from "utils/getReqDataForUpdate";
import getLastNameWithInitials from "utils/getLastNameWithInitials";

const { Text } = Typography;
const CancelReqModal = React.lazy(() => import("./modal"));

interface IReqCard {
    reqData: IAccessAppDataByCurrentUserViewModel;
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
    updateReqData: (data: IAccessAppDataByCurrentUserViewModel) => void;
}

const ReqActionsCard: FC<IReqCard> = ({ reqData, currentReqData, updateReqData }) => {
    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    const [form] = Form.useForm();

    const [appHistory, setAppHistory] = useState<IAccessApplicationHistoryViewModel[]>([]);

    const applicationId = currentReqData.applicationId;
    const comment = currentReqData.comment;
    const cancelReason = currentReqData.cancelReason;

    const creatorUser = currentReqData.creatorUser || {};
    const [creatorUserPhoto, setCreatorUserPhoto] = useState<string | undefined>(undefined);

    const [reqApproved, setReqApproved] = useState(false);
    const [reqCancelled, setReqCancelled] = useState(false);

    const [cancelModalVisible, setCancelModalVisible] = useState(false);

    const {
        approveAccessApplicationById,
        rejectAccessApplicationById,
        getAccessApplicationHistoryById
    } = useSimpleHttpFunctions();

    useEffect(() => {
        setReqApproved(false);
        setReqCancelled(false);
    }, [applicationId]);

    useEffect(() => {
        if (applicationId) {
            initAppHistory();
        }
    }, [applicationId]);

    const initAppHistory = async () => {
        const hist = await getAccessApplicationHistoryById(applicationId);
        setAppHistory(hist);
    };

    useEffect(() => {
        if (comment) {
            const photoId = creatorUser?.profilePhotoId;
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

    const onApproveRequest = useCallback(async () => {
        await approveAccessApplicationById(applicationId);

        //transform and add current req to approved reqs
        const dataForUpdate = getReqDataForUpdate(
            reqData,
            currentReqData,
            applicationId,
            accessRequestStatuses.ON_PROCESS,
            accessRequestStatuses.ON_APPROVEMENT,
            true
        );

        updateReqData(dataForUpdate);
        initAppHistory();
        setReqApproved(true);
    }, [applicationId, reqData, currentReqData, updateReqData, initAppHistory]);

    const onCancelRequest = useCallback(async () => {
        setCancelModalVisible(true);
    }, []);

    const onFinishCancelModal = useCallback(
        async (data: { reason: string }) => {
            await rejectAccessApplicationById(data, applicationId);

            const dataForUpdate = getReqDataForUpdate(
                reqData,
                currentReqData,
                applicationId,
                accessRequestStatuses.REJECTED,
                accessRequestStatuses.ON_APPROVEMENT,
                true
            );

            updateReqData(dataForUpdate);
            initAppHistory();
            setReqCancelled(true);
            setCancelModalVisible(false);
        },
        [applicationId, reqData, currentReqData, updateReqData, initAppHistory]
    );

    return (
        <Row className={classes.container}>
            <Row justify={"space-between"} className={classes.btnContainer}>
                {reqApproved ? (
                    <span className={classes.agreedText}>Заявка успешно подписана!</span>
                ) : reqCancelled ? (
                    <span className={classes.cancelledText}>Заявка отклонена!</span>
                ) : (
                    <>
                        <Button
                            onClick={onCancelRequest}
                            customType={"removingGrounded"}
                            icon={<CloseOutlined />}
                        >
                            Отклонить
                        </Button>
                        <Button
                            onClick={onApproveRequest}
                            customType={"addingGrounded"}
                            icon={<CheckOutlined />}
                        >
                            Подписать
                        </Button>
                    </>
                )}
            </Row>
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
                                            {accessRequestHistoryTranscripts[histItem.status]}
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
            <Suspense>
                <CancelReqModal
                    form={form}
                    okText={"Отправить"}
                    title={"При отклонении заявки необходимо указать причину"}
                    isVisible={cancelModalVisible}
                    setIsVisible={setCancelModalVisible}
                    onFinish={onFinishCancelModal}
                />
            </Suspense>
        </Row>
    );
};
export default memo(ReqActionsCard);
