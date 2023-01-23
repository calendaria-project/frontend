import { Row, Typography, Collapse, Checkbox } from "antd";
import React, { FC, memo } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import { IAccessAppDataByCurrentUserViewModel } from "interfaces";
import { accessRequestTranscripts, appTypesEnumTranscripts } from "data/transcripts";
import { getFormattedDateFromNow } from "utils/getFormattedDates";
import { getReqBallStyle } from "utils/getReqBallStyle";

const { Panel } = Collapse;
const { Text } = Typography;

const AccessRequest: FC<{ reqData: IAccessAppDataByCurrentUserViewModel }> = ({ reqData }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

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
                        {(data || []).map((accessItem, aIndex) => (
                            <Collapse
                                key={accessItem.applicationId}
                                className={classes.reqCollapseItem}
                            >
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
                        ))}
                    </React.Fragment>
                ))}
            </Row>
        </Row>
    );
};

export default memo(AccessRequest);
