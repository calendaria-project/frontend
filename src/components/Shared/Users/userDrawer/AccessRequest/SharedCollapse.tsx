import React, { FC, memo } from "react";
import { Checkbox, Collapse, Row, Typography } from "antd";
import { accessRequestTranscripts, appTypesEnumTranscripts } from "data/transcripts";
import { getFormattedDateFromNow } from "utils/getFormattedDates";
import { getReqBallStyle } from "utils/getReqBallStyle";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { IAccessAppDataByCurrentUserInKeyViewModel } from "interfaces";

const { Panel } = Collapse;
const { Text } = Typography;

const SharedCollapse: FC<{
    accessItem: IAccessAppDataByCurrentUserInKeyViewModel;
    collapseKey: number;
}> = ({ accessItem, collapseKey }) => {
    const theme = useTheme<ITheme>();
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
        <Collapse className={classes.reqCollapseItem}>
            <Panel
                header={getPanelHeader(accessItem.appType, accessItem.createdAt, accessItem.status)}
                key={collapseKey}
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
                            {item.accessType?.nameRu ?? item.tariff?.nameRu ?? ""}
                        </Text>
                    </Row>
                ))}
            </Panel>
        </Collapse>
    );
};
export default memo(SharedCollapse);
