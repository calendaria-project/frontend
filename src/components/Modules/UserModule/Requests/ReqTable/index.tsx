import { message, Row, Typography } from "antd";
import React, { FC, memo, Suspense, useCallback, useState } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import { IAccessAppDataByCurrentUserViewModel } from "interfaces";
import {
    accessRequestTranscripts,
    appTypesEnumTranscripts,
    accessItemRequestTranscripts,
    accessItemRequestStatuses
} from "data/enums";

import { CloseOutlined } from "@ant-design/icons";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import EmptyTableContent from "components/Shared/tableRenderer/EmptyTableContent";

const CancelReqModal = React.lazy(
    () => import("components/Shared/modalRenderer/ReadyModals/SimpleConfirmationModal")
);

const { Text } = Typography;

const ReqTable: FC<{
    reqData: IAccessAppDataByCurrentUserViewModel;
    setReqData: (v: IAccessAppDataByCurrentUserViewModel) => void;
}> = ({ reqData, setReqData }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const [cancelId, setCancelId] = useState<number | undefined>();
    const [cancelReqModalVisible, setCancelReqModalVisible] = useState(false);

    const { deleteAccessApplicationById } = useSimpleHttpFunctions();

    const handleCancelBtnClick = (id: number) => () => {
        setCancelId(id);
        setCancelReqModalVisible(true);
    };

    const onCancelRequest = useCallback(async () => {
        if (cancelId) {
            const data = await deleteAccessApplicationById(cancelId).catch(() =>
                message.error("Ошибка отмены заявки!")
            );
        }
    }, [cancelId]);

    const getReqStatus = (itemStatus: string) => {
        return (
            <div className={classes.statusContainer}>
                <div
                    className={classes.statusBall}
                    style={{
                        background:
                            itemStatus === accessItemRequestStatuses.CANCELED
                                ? theme.color.removing + ""
                                : itemStatus === accessItemRequestStatuses.DONE
                                ? theme.color.successful + ""
                                : theme.color.between + ""
                    }}
                />
                <Text strong>{accessItemRequestTranscripts[itemStatus] ?? ""}</Text>
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
                            {(data || []).map((accessItem) => (
                                <Row
                                    key={accessItem.applicationId}
                                    className={classes.reqContainer}
                                >
                                    <Text strong>
                                        {appTypesEnumTranscripts[accessItem.appType] ?? ""}
                                    </Text>
                                    <Text>
                                        {new Date(accessItem.createdAt).toLocaleDateString("ru-RU")}
                                    </Text>
                                    <Text>
                                        {new Date(accessItem.endDate).toLocaleDateString("ru-RU")}
                                    </Text>
                                    {getReqStatus(accessItem.items?.[0]?.status)}
                                    {accessItem.items?.[0]?.status ===
                                    accessItemRequestStatuses.ON_PROCESS ? (
                                        <div
                                            onClick={handleCancelBtnClick(accessItem.applicationId)}
                                            className={classes.cancelReqTextContainer}
                                        >
                                            <CloseOutlined className={classes.cancelIcon} />
                                            <span className={classes.cancelText}>
                                                Отменить заявку
                                            </span>
                                        </div>
                                    ) : (
                                        <div />
                                    )}
                                </Row>
                            ))}
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
        </Row>
    );
};

export default memo(ReqTable);
