import { Row, Typography, Collapse, Checkbox } from "antd";
import React, { FC, memo, useState, Suspense } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import { IAccessAppDataByCurrentUserViewModel } from "interfaces";
import { accessRequestTranscripts, appTypesEnumTranscripts } from "data/transcripts";
import { getFormattedDateFromNow } from "utils/getFormattedDates";
import { getReqBallStyle } from "utils/getReqBallStyle";
import { accessRequestStatuses } from "data/enums";
import Button from "ui/Button";

const ReqAgreementDrawer = React.lazy(
    () => import("components/Modules/HeadModule/Requests/ReqTable/TableAgreementDrawer")
);

const { Panel } = Collapse;
const { Text } = Typography;

const AccessRequest: FC<{
    reqData: IAccessAppDataByCurrentUserViewModel;
    updateReqData: (v: IAccessAppDataByCurrentUserViewModel) => void;
}> = ({ reqData, updateReqData }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const [reqAgreementDrawerOpened, setReqAgreementDrawerOpened] = useState(false);
    const [currentAppId, setCurrentAppId] = useState<number | undefined>(undefined);

    const handleOpenDrawer = (applicationId: number) => () => {
        setCurrentAppId(applicationId);
        setReqAgreementDrawerOpened(true);
    };

    const getPanelHeader = (appType: string, createdAt: string, status: string) => {
        return (
            <Row className={classes.panelContainer}>
                <Text>{appTypesEnumTranscripts[appType] ?? ""}</Text>
                <Text>{getFormattedDateFromNow(createdAt)}</Text>
                <div className={classes.panelStatusContainer}>
                    <div
                        className={classes.panelStatusBall}
                        style={getReqBallStyle(theme, status)}
                    />
                    <Text strong>{accessRequestTranscripts[status] ?? ""}</Text>
                </div>
            </Row>
        );
    };

    return (
        <Row className={classes.accessRequestsContainer}>
            <Row>
                <Text className={classes.title}>Учетные записи</Text>
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
                                    <Collapse className={classes.reqCollapseItem}>
                                        <Panel
                                            key={aIndex}
                                            header={getPanelHeader(
                                                accessItem.appType,
                                                accessItem.createdAt,
                                                accessItem.status
                                            )}
                                        >
                                            {(accessItem.items || []).map((item, index) => (
                                                <Row
                                                    key={"_" + item.accessType?.code + index}
                                                    className={classes.accessItemContainer}
                                                >
                                                    <Checkbox
                                                        className={classes.accessItemCheckbox}
                                                        disabled
                                                        checked={item.needAccess}
                                                    >
                                                        {item.appItemType?.nameRu}
                                                    </Checkbox>
                                                    <Text className={classes.accessItemStatus}>
                                                        {item.accessType?.nameRu ??
                                                            item.tariff?.nameRu ??
                                                            ""}
                                                    </Text>
                                                </Row>
                                            ))}
                                        </Panel>
                                    </Collapse>
                                    {status === accessRequestStatuses.ON_APPROVEMENT && (
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
                />
            </Suspense>
        </Row>
    );
};

export default memo(AccessRequest);
