import { Row, Typography } from "antd";
import React, { FC, memo, useState, Suspense } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import { IAccessAppDataByCurrentUserViewModel } from "interfaces";
import { accessRequestTranscripts } from "data/transcripts";
import { accessRequestStatuses } from "data/enums";
import Button from "ui/Button";
import SharedCollapse from "components/Users/userDrawer/AccessRequest/SharedCollapse";

const ReqAgreementDrawer = React.lazy(
    () => import("modules/HeadModule/Requests/ReqTable/TableAgreementDrawer")
);

const { Text } = Typography;

const AccessRequest: FC<{
    isCurrentUserCreatorFlag: boolean;
    currentUserId: string;
    reqData: IAccessAppDataByCurrentUserViewModel;
    updateReqData: (v: IAccessAppDataByCurrentUserViewModel) => void;
}> = ({ isCurrentUserCreatorFlag, currentUserId, reqData, updateReqData }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const [reqAgreementDrawerOpened, setReqAgreementDrawerOpened] = useState(false);
    const [currentAppId, setCurrentAppId] = useState<number | undefined>(undefined);

    const handleOpenDrawer = (applicationId: number) => () => {
        setCurrentAppId(applicationId);
        setReqAgreementDrawerOpened(true);
    };

    return (
        <Row className={classes.accessRequestsContainer}>
            <Row>
                <Text className={classes.title}>Заявки</Text>
            </Row>
            <Row className={classes.headerRow}>
                <Text strong>Приложение</Text>
                <Text strong>Дата отправки</Text>
                <Text strong>Статус</Text>
            </Row>
            <Row className={classes.allReqsRow}>
                {Object.entries(reqData).map(([key, data], index) => (
                    <React.Fragment key={"_" + key + index}>
                        <Row className={classes.reqTitle}>
                            <Text strong>{accessRequestTranscripts[key]}</Text>
                        </Row>
                        {(data || []).map((accessItem, aIndex) => {
                            const status = accessItem.status;
                            const applicationId = accessItem.applicationId;
                            console.log(accessItem);
                            return (
                                <React.Fragment key={applicationId}>
                                    <SharedCollapse collapseKey={aIndex} accessItem={accessItem} />
                                    {status === accessRequestStatuses.ON_APPROVEMENT &&
                                        !isCurrentUserCreatorFlag &&
                                        currentUserId !== accessItem.creatorUserId && (
                                            <Row
                                                className={classes.onApprovementBtnContainer}
                                                justify={"end"}
                                            >
                                                <Button
                                                    onClick={handleOpenDrawer(applicationId)}
                                                    customType={"regular"}
                                                >
                                                    Перейти к согласованию
                                                </Button>
                                            </Row>
                                        )}
                                </React.Fragment>
                            );
                        })}
                    </React.Fragment>
                ))}
            </Row>
            <Suspense>
                <ReqAgreementDrawer
                    open={reqAgreementDrawerOpened}
                    setOpen={setReqAgreementDrawerOpened}
                    reqData={reqData}
                    currentAppId={currentAppId!}
                    updateReqData={updateReqData}
                    onlyFilterReqs={false}
                    hideToCardBtnFlag={true}
                />
            </Suspense>
        </Row>
    );
};

export default memo(AccessRequest);
