import { Row, Typography } from "antd";
import React, { FC, memo } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import { IAccessAppDataByCurrentUserViewModel } from "interfaces";
import { accessRequestTranscripts } from "data/transcripts";

import SharedCollapse from "components/Users/userDrawer/AccessRequest/SharedCollapse";

const { Text } = Typography;

const AccessRequest: FC<{
    reqData: IAccessAppDataByCurrentUserViewModel;
}> = ({ reqData }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

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
                            const applicationId = accessItem.applicationId;
                            console.log(accessItem);
                            return (
                                <React.Fragment key={applicationId}>
                                    <SharedCollapse collapseKey={aIndex} accessItem={accessItem} />
                                </React.Fragment>
                            );
                        })}
                    </React.Fragment>
                ))}
            </Row>
        </Row>
    );
};

export default memo(AccessRequest);
