import { Col, Row, Typography, Collapse, Checkbox } from "antd";
import React, { FC, memo } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import { IAccessAppDataByCurrentUserViewModel } from "interfaces";
import {
    accessRequestTranscripts,
    appTypesEnumTranscripts,
    accessItemRequestTranscripts
} from "data/enums";

const { Panel } = Collapse;
const { Text } = Typography;

const AccessRequest: FC<{ reqData: IAccessAppDataByCurrentUserViewModel }> = ({ reqData }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const getPanelHeader = (type: string, date: string, status: string) => {
        return (
            <Row style={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Text>{appTypesEnumTranscripts[type]}</Text>
                <Text>{date}</Text>
                <Text>{accessItemRequestTranscripts[status]}</Text>
            </Row>
        );
    };

    return (
        <Row className={classes.requestsContainer}>
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
                        {data.map((accessItem, aIndex) => (
                            <Collapse
                                key={accessItem.applicationId}
                                className={classes.reqCollapseItem}
                            >
                                <Panel
                                    key={aIndex}
                                    header={getPanelHeader(
                                        accessItem.appType,
                                        accessItem.createdAt,
                                        accessItem.items[0]?.status
                                    )}
                                >
                                    {accessItem.items.map((item, index) => (
                                        <Row
                                            key={"_" + item.accessType?.code + index}
                                            style={{
                                                margin: "8px 0px",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <Checkbox disabled checked={item.needAccess}>
                                                {item.appItemType?.nameRu}
                                            </Checkbox>
                                            <Text>
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
