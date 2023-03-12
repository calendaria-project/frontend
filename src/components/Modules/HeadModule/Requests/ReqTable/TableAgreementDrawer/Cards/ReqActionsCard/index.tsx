import React, { FC, memo, useCallback, useEffect, useState, Suspense } from "react";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel,
    IAccessApplicationHistoryViewModel
} from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { Form, Row } from "antd";
import Button from "ui/Button";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { accessRequestStatuses } from "data/enums";
import getReqDataForUpdate from "utils/getReqDataForUpdate";
import ReqExtraCardSharedContent from "components/Shared/Requests/InfoDrawer/ReqExtraCard/ReqExtraCardSharedContent";

const CancelReqModal = React.lazy(() => import("./modal"));

interface IReqCard {
    reqData: IAccessAppDataByCurrentUserViewModel;
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
    updateReqData: (data: IAccessAppDataByCurrentUserViewModel) => void;
    onlyFilterReqs?: boolean;
}

const ReqActionsCard: FC<IReqCard> = ({
    reqData,
    currentReqData,
    updateReqData,
    onlyFilterReqs
}) => {
    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    const [form] = Form.useForm();

    const [appHistory, setAppHistory] = useState<IAccessApplicationHistoryViewModel[]>([]);

    const applicationId = currentReqData.applicationId;

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

    const onApproveRequest = useCallback(async () => {
        await approveAccessApplicationById(applicationId);

        //transform and add current req to approved reqs
        const dataForUpdate = getReqDataForUpdate(
            reqData,
            currentReqData,
            applicationId,
            accessRequestStatuses.ON_PROCESS,
            accessRequestStatuses.ON_APPROVEMENT,
            onlyFilterReqs ?? true
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
        <Row>
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
            <ReqExtraCardSharedContent currentReqData={currentReqData} appHistory={appHistory} />
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
