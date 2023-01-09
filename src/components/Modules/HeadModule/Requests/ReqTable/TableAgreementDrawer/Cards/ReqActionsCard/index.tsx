import React, { FC, memo, useCallback, useEffect, useState, Suspense } from "react";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
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

const { Text } = Typography;
const CancelReqModal = React.lazy(() => import("./modal"));

interface IReqCard {
    reqData: IAccessAppDataByCurrentUserInKeyViewModel;
}

const ReqActionsCard: FC<IReqCard> = ({ reqData }) => {
    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    const [form] = Form.useForm();

    const [appHistory, setAppHistory] = useState<IAccessApplicationHistoryViewModel[]>([]);

    const applicationId = reqData.applicationId;
    const comment = reqData.comment;

    const creatorUser = reqData.creatorUser;
    const [creatorUserPhoto, setCreatorUserPhoto] = useState<string | undefined>(undefined);

    const [reqApproved, setReqApproved] = useState(false);
    const [reqCancelled, setReqCancelled] = useState<{ comment: string | undefined }>({
        comment: undefined
    });

    const [cancelModalVisible, setCancelModalVisible] = useState(false);

    const {
        approveAccessApplicationById,
        cancelAccessApplicationById,
        getAccessApplicationHistoryById
    } = useSimpleHttpFunctions();

    useEffect(() => {
        initAppHistory();
    }, [applicationId]);

    const initAppHistory = async () => {
        const hist = await getAccessApplicationHistoryById(applicationId);
        setAppHistory(hist);
    };

    useEffect(() => {
        setReqApproved(false);
        setReqCancelled({ comment: undefined });
    }, [applicationId]);

    useEffect(() => {
        if (comment) {
            const photoId = creatorUser.profilePhotoId;
            if (photoId) {
                actionMethodResultSync("FILE", `file/download/${photoId}/base64`, "get").then(
                    (res) => {
                        setCreatorUserPhoto(res);
                    }
                );
            }
        }
    }, [creatorUser, comment]);

    const onApproveRequest = useCallback(async () => {
        await approveAccessApplicationById(applicationId);
        setReqApproved(true);
    }, [applicationId]);

    const onCancelRequest = useCallback(async () => {
        setCancelModalVisible(true);
    }, []);

    const onFinishCancelModal = useCallback(
        async (data: { comment: string }) => {
            await cancelAccessApplicationById(applicationId);
            setReqCancelled(data);
            setCancelModalVisible(false);
        },
        [applicationId]
    );

    return (
        <Row className={classes.container}>
            <Row justify={"space-between"} className={classes.btnContainer}>
                {reqApproved ? (
                    <span className={classes.agreedText}>Заявка успешно подписана!</span>
                ) : reqCancelled.comment ? (
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
                            const histUser = histItem.user;
                            return (
                                <React.Fragment key={histItem.historyId}>
                                    <Row className={classes.histRow}>
                                        <div>{`${histItem.status} ${histUser.lastname} ${
                                            histUser.firstname[0] + "."
                                        }${histUser.patronymic?.[0] || ""}`}</div>
                                        <div className={classes.extraText}>
                                            {`${new Date(histItem.createdAt).toLocaleDateString(
                                                "ru-RU",
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                }
                                            )}`}
                                        </div>
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
