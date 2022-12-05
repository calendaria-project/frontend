import { Col, Row } from "antd";
import Button from "ui/Button";
import React, { FC } from "react";
import { useTheme } from "react-jss";
import useStyles from "./styles";

interface IModalBtns {
    okText: string;
    onClick: () => void;
}

const ModalBtns: FC<IModalBtns> = ({ okText, onClick }) => {
    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    return (
        <Row className={classes.btnRow} align={"middle"} justify={"center"} gutter={[16, 16]}>
            <Col span={12}>
                <Button className={classes.modalBtns} customType={"regular"} htmlType="submit">
                    {okText}
                </Button>
            </Col>
            <Col span={12}>
                <Button className={classes.modalBtns} customType={"primary"} onClick={onClick}>
                    Отмена
                </Button>
            </Col>
        </Row>
    );
};
export default ModalBtns;
