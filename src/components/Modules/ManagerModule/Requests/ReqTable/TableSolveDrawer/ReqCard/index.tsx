import React, { FC, memo, useCallback, useEffect, useState, Suspense } from "react";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel
} from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { Row, Col, Typography } from "antd";
import { accessItemRequestTranscripts } from "data/transcripts";
import { ITheme } from "styles/theme/interface";
import Button from "ui/Button";
import getReqDataForUpdate from "utils/getReqDataForUpdate";
import { accessRequestStatuses } from "data/enums";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import ReqCardSharedContent from "components/Shared/SharedRequestInfoDrawer/Cards/ReqCard/ReqCardSharedContent";

const SimpleConfirmationModal = React.lazy(
    () => import("components/Shared/modalRenderer/ReadyModals/SimpleConfirmationModal")
);

const { Text } = Typography;

interface IReqCard {
    reqData: IAccessAppDataByCurrentUserViewModel;
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
    updateReqData: (data: IAccessAppDataByCurrentUserViewModel) => void;
    initAppHistory: () => void;
    reqFinishedFlag: boolean;
}

const ReqCard: FC<IReqCard> = ({
    reqData,
    currentReqData,
    updateReqData,
    initAppHistory,
    reqFinishedFlag
}) => {
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

    return (
        <Row className={classes.container}>
            <Row align={"middle"} justify={"space-between"} className={classes.titleContainer}>
                <Text className={classes.title}>Заявка #{currentReqData.applicationId}</Text>
                <Col className={classes.btnsCol}>
                    <div
                        style={{
                            background: reqFinishedFlag
                                ? theme.color.successful
                                : theme.color.extraText + ""
                        }}
                        className={classes.statusBtn}
                    >
                        {!reqFinishedFlag
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
                <ReqCardSharedContent currentReqData={currentReqData} />
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
