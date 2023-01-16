import { message, Row, Typography } from "antd";
import React, { FC, memo, Suspense, useCallback, useState } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel
} from "interfaces";
import { accessRequestStatuses } from "data/enums";
import { accessRequestTranscripts, appTypesEnumTranscripts } from "data/transcripts";
import { getFormattedDateFromNow } from "utils/getFormattedDates";

import { CloseOutlined } from "@ant-design/icons";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import EmptyTableContent from "components/Shared/tableRenderer/EmptyTableContent";
import { getReqBallStyle } from "utils/getReqBallStyle";
import getReqDataForUpdate from "utils/getReqDataForUpdate";

const CancelReqModal = React.lazy(
    () => import("components/Shared/modalRenderer/ReadyModals/SimpleConfirmationModal")
);
const SharedInfoDrawer = React.lazy(() => import("components/Shared/SharedRequestInfoDrawer"));

const { Text } = Typography;

const ReqTable: FC<{
    reqData: IAccessAppDataByCurrentUserViewModel;
    updateReqData: (data: IAccessAppDataByCurrentUserViewModel) => void;
}> = ({ reqData, updateReqData }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const [reqForCancel, setReqForCancel] = useState<IAccessAppDataByCurrentUserInKeyViewModel>(
        {} as IAccessAppDataByCurrentUserInKeyViewModel
    );

    const [sharedInfoDrawerOpened, setSharedInfoDrawerOpened] = useState(false);
    const [currentAppId, setCurrentAppId] = useState<number | undefined>();

    const [cancelReqModalVisible, setCancelReqModalVisible] = useState(false);

    const { cancelAccessApplicationById } = useSimpleHttpFunctions();

    const handleOpenInfoDrawer = (applicationId: number) => () => {
        setCurrentAppId(applicationId);
        setSharedInfoDrawerOpened(true);
    };

    const handleCancelBtnClick = (req: IAccessAppDataByCurrentUserInKeyViewModel) => () => {
        setReqForCancel(req);
        setCancelReqModalVisible(true);
    };

    const onCancelRequest = useCallback(async () => {
        const cancelId = reqForCancel.applicationId;
        if (cancelId) {
            await cancelAccessApplicationById(cancelId).catch(() =>
                message.error("Ошибка отмены заявки!")
            );

            const dataForUpdate = getReqDataForUpdate(
                reqData,
                reqForCancel,
                cancelId,
                accessRequestStatuses.CANCELED
            );

            updateReqData(dataForUpdate);
            message.success("Заявка отменена!");
        }
    }, [reqForCancel, reqData, updateReqData]);

    const getReqStatusWithBall = (status: string) => {
        return (
            <div className={classes.statusContainer}>
                <div className={classes.statusBall} style={getReqBallStyle(theme, status)} />
                <Text strong>{accessRequestTranscripts[status] ?? ""}</Text>
            </div>
        );
    };

    return (
        <Row className={classes.wrapper}>
            <Row className={classes.headerRow}>
                <Text className={classes.headerText}>Вид заявки</Text>
                <Text className={classes.headerText}>Дата отправки</Text>
                <Text className={classes.headerText}>Дедлайн заявки</Text>
                <Text className={classes.headerText}>Статус</Text>
                <Text className={classes.headerText}>Действия</Text>
            </Row>
            {isObjectNotEmpty(reqData) ? (
                <Row className={classes.allReqsRow}>
                    {Object.entries(reqData).map(([key, data], index) => (
                        <React.Fragment key={"_" + key + index}>
                            <Row className={classes.reqTitle}>
                                <Text className={classes.reqTitleText}>
                                    {accessRequestTranscripts[key]}
                                </Text>
                            </Row>
                            {(data || []).map((accessItem) => {
                                const reqStatus = accessItem.status;
                                const applicationId = accessItem.applicationId;
                                return (
                                    <Row key={applicationId} className={classes.reqContainer}>
                                        <Text
                                            onClick={handleOpenInfoDrawer(applicationId)}
                                            className={classes.reqTypeText}
                                            strong
                                        >
                                            {appTypesEnumTranscripts[accessItem.appType] ?? ""}
                                        </Text>
                                        <Text>{getFormattedDateFromNow(accessItem.createdAt)}</Text>
                                        <Text>{getFormattedDateFromNow(accessItem.endDate)}</Text>
                                        {getReqStatusWithBall(reqStatus)}
                                        {reqStatus === accessRequestStatuses.ON_APPROVEMENT ? (
                                            <div
                                                onClick={handleCancelBtnClick(accessItem)}
                                                className={classes.cancelReqTextContainer}
                                            >
                                                <CloseOutlined className={classes.cancelIcon} />
                                                <span className={classes.cancelText}>
                                                    Отменить заявку
                                                </span>
                                            </div>
                                        ) : (
                                            <div className={classes.emptyDiv} />
                                        )}
                                    </Row>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </Row>
            ) : (
                <EmptyTableContent />
            )}
            <Suspense>
                <CancelReqModal
                    okText={"Подтвердить"}
                    title={"Вы уверены что хотите отменить вашу заявку?"}
                    isVisible={cancelReqModalVisible}
                    setIsVisible={setCancelReqModalVisible}
                    confirmAction={onCancelRequest}
                />
            </Suspense>
            <Suspense>
                <SharedInfoDrawer
                    open={sharedInfoDrawerOpened}
                    setOpen={setSharedInfoDrawerOpened}
                    currentAppId={currentAppId!}
                />
            </Suspense>
        </Row>
    );
};

export default memo(ReqTable);
