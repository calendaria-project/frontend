import { Row, Typography } from "antd";
import React, { FC, memo } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import { IAccessAppDataByCurrentUserViewModel } from "interfaces";
import { accessRequestTranscripts } from "data/transcripts";
import SharedCollapse from "components/Users/userDrawer/AccessRequest/SharedCollapse";

// const TableSolveDrawer = React.lazy(
//     () => import("components/Modules/ManagerModule/Requests/ReqTable/TableSolveDrawer")
// );

const { Text } = Typography;

const AccessRequest: FC<{
    // isCurrentUserCreatorFlag: boolean;
    // currentUserId: string;
    reqData: IAccessAppDataByCurrentUserViewModel;
    // updateReqData: (v: IAccessAppDataByCurrentUserViewModel) => void;
}> = ({ reqData /*isCurrentUserCreatorFlag, currentUserId, updateReqData*/ }) => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    // const [reqAgreementDrawerOpened, setReqAgreementDrawerOpened] = useState(false);
    // const [currentAppId, setCurrentAppId] = useState<number | undefined>(undefined);

    // const handleOpenDrawer = (applicationId: number) => () => {
    //     setCurrentAppId(applicationId);
    //     setReqAgreementDrawerOpened(true);
    // };

    return (
        <>
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
                            // const status = accessItem.status;
                            const applicationId = accessItem.applicationId;
                            console.log(accessItem);
                            return (
                                <React.Fragment key={applicationId}>
                                    <SharedCollapse collapseKey={aIndex} accessItem={accessItem} />
                                    {/*{status === accessRequestStatuses.ON_PROCESS &&*/}
                                    {/*    !isCurrentUserCreatorFlag &&*/}
                                    {/*    currentUserId !== accessItem.creatorUserId && (*/}
                                    {/*        <Row*/}
                                    {/*            className={classes.onApprovementBtnContainer}*/}
                                    {/*            justify={"end"}*/}
                                    {/*        >*/}
                                    {/*            <Button*/}
                                    {/*                onClick={handleOpenDrawer(applicationId)}*/}
                                    {/*                customType={"regular"}*/}
                                    {/*            >*/}
                                    {/*                Перейти к выполнению*/}
                                    {/*            </Button>*/}
                                    {/*        </Row>*/}
                                    {/*    )}*/}
                                </React.Fragment>
                            );
                        })}
                    </React.Fragment>
                ))}
            </Row>
            {/*<Suspense>*/}
            {/*    <TableSolveDrawer*/}
            {/*        open={reqAgreementDrawerOpened}*/}
            {/*        setOpen={setReqAgreementDrawerOpened}*/}
            {/*        reqData={reqData}*/}
            {/*        currentAppId={currentAppId!}*/}
            {/*        updateReqData={updateReqData}*/}
            {/*    />*/}
            {/*</Suspense>*/}
        </>
    );
};

export default memo(AccessRequest);
