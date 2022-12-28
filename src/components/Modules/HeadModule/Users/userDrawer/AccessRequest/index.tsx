import { Col, Row, Typography } from "antd";
import React, { FC } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";

const { Text } = Typography;

const AccessRequest: FC<{ reqData: any }> = ({ reqData }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    return (
        <Row className={classes.requestsContainer}>
            <Row>
                <Text className={classes.title}>Учетные записи</Text>
            </Row>
            <Row className={classes.headerCol}>
                <Text strong>Приложение</Text>
                <Text strong>Дата отправки</Text>
                <Text strong>Статус</Text>
            </Row>
        </Row>
    );
};

export default AccessRequest;
