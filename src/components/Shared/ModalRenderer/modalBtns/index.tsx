import { Col, Row } from "antd";
import Button from "ui/Button";
import React, { FC } from "react";
import { useTheme } from "react-jss";
import useStyles from "./styles";

interface IModalBtns {
    okText: string;
    onCancel?: () => void;
    onClick?: () => void;
}

const ModalBtns: FC<IModalBtns> = ({ okText, onCancel, onClick }) => {
    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <Row className={classes.btnRow} align={"middle"} justify={"center"} gutter={[16, 16]}>
            <Col span={12}>
                <Button
                    className={classes.modalBtns}
                    onClick={handleClick}
                    customType={"regular"}
                    htmlType="submit"
                >
                    {okText}
                </Button>
            </Col>
            <Col span={12}>
                <Button className={classes.modalBtns} customType={"primary"} onClick={handleCancel}>
                    Отмена
                </Button>
            </Col>
        </Row>
    );
};
export default ModalBtns;
