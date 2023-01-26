import { Modal, Row, Checkbox, Col } from "antd";
import React, { memo, useCallback, useState } from "react";
import useStyles from "./styles";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import Button from "ui/Button";

const instructionsCheckbox = "instructionsCheckbox";
const obligationsCheckbox = "obligationsCheckbox";
const dataCheckbox = "dataCheckbox";

export interface ISignModal {
    title: string;
    setIsVisible: (val: boolean) => void;
    isVisible: boolean;
    onSignTask: () => void;
}

const SignModal = ({ title, isVisible, setIsVisible, onSignTask }: ISignModal) => {
    const classes = useStyles();

    const [checkBoxValues, setCheckBoxValues] = useState({
        [instructionsCheckbox]: false,
        [obligationsCheckbox]: false,
        [dataCheckbox]: false
    });

    const trulyCheckboxValuesFlag = Object.values(checkBoxValues).every((v) => v);

    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onChange = useCallback(
        (property: string) => (e: CheckboxChangeEvent) => {
            setCheckBoxValues({
                ...checkBoxValues,
                [property]: e.target.checked
            });
        },
        [checkBoxValues]
    );

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Row className={classes.container}>
                <Row className={classes.fullWidth}>
                    <Checkbox
                        value={checkBoxValues[instructionsCheckbox]}
                        onChange={onChange(instructionsCheckbox)}
                        className={classes.checkbox}
                    >
                        С Инструкциями пользования по эксплуатации компьютерного оборудования и
                        программного обеспечения ознакомлен и обязуюсь их выполнять*
                    </Checkbox>
                </Row>
                <Row className={classes.fullWidth}>
                    <Checkbox
                        value={checkBoxValues[obligationsCheckbox]}
                        onChange={onChange(obligationsCheckbox)}
                        className={classes.checkbox}
                    >
                        Принимаю на себя обязательство о неразглашении сведений конфиденциального
                        характера, коммерческой тайны и сведений, отнесенных к конфиденциальной
                        информации при предоставлении доступа к ним*
                    </Checkbox>
                </Row>
                <Row className={classes.fullWidth}>
                    <Checkbox
                        value={checkBoxValues[dataCheckbox]}
                        onChange={onChange(dataCheckbox)}
                        className={classes.checkbox}
                    >
                        Даю свое согласие на обработку моих персональных данных (в соответствии со
                        ст. 8 Закона Республики Казахстан от 21 мая 2013 года №94-V «О персональных
                        данных и их защите»*
                    </Checkbox>
                </Row>
                <Row
                    className={classes.btnContainer}
                    align={"middle"}
                    justify={"center"}
                    gutter={[16, 16]}
                >
                    <Col span={12}>
                        <Button
                            className={classes.fullWidth}
                            disabled={!trulyCheckboxValuesFlag}
                            onClick={onSignTask}
                            customType={"regular"}
                        >
                            Подписать
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Button
                            className={classes.fullWidth}
                            customType={"cancel"}
                            onClick={handleCancel}
                        >
                            Отмена
                        </Button>
                    </Col>
                </Row>
            </Row>
        </Modal>
    );
};

export default memo(SignModal);
