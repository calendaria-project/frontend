import { Col, Row, Typography } from "antd";
import emptyRequestsImage from "assets/icons/emptyRequests.png";
import Button from "ui/Button";
import React, { FC, memo } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";

const { Text } = Typography;

const EmptyAccessRequest: FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles({ theme });

    return (
        <Row className={classes.centeredRequestsContainer}>
            <Col className={classes.emptyRequests} span={24}>
                <img src={emptyRequestsImage} alt={"empty requests"} />
                <Text className={classes.emptyRequestsText}>
                    Учетные записи отсуствуют. Создайте <br />
                    заявку или ждите новых заявок!
                </Text>
                <Button onClick={onOpenModal} className={classes.createBtn} customType={"cancel"}>
                    Создать
                </Button>
            </Col>
        </Row>
    );
};

export default memo(EmptyAccessRequest);
