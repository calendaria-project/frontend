import React, { FC, memo, useCallback, useEffect, useState } from "react";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel
} from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { Row, Col, Typography, Checkbox, message } from "antd";
import { ITheme } from "styles/theme/interface";
import Button from "ui/Button";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import getReqDataForUpdate from "utils/getReqDataForUpdate";
import { accessRequestStatuses } from "data/enums";
import ReqCardSharedContent from "components/Shared/Requests/InfoDrawer/ReqCard/ReqCardSharedContent";

interface IReqCard {
    reqData: IAccessAppDataByCurrentUserViewModel;
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
    updateReqData: (data: IAccessAppDataByCurrentUserViewModel) => void;
    initAppHistory: () => void;
}

const { Text } = Typography;

const instructionsCheckbox = "instructionsCheckbox";
const obligationsCheckbox = "obligationsCheckbox";
const dataCheckbox = "dataCheckbox";

const ReqCard: FC<IReqCard> = ({ reqData, currentReqData, updateReqData, initAppHistory }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const { signAccessApplicationTaskById } = useSimpleHttpFunctions();

    const [checkBoxValues, setCheckBoxValues] = useState({
        [instructionsCheckbox]: false,
        [obligationsCheckbox]: false,
        [dataCheckbox]: false
    });
    const trulyCheckboxValuesFlag = Object.values(checkBoxValues).every((v) => v);

    const [taskSigned, setTaskSigned] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        setTaskSigned(false);
    }, [currentReqData]);

    const onChangeCheckbox = useCallback(
        (property: string) => (e: CheckboxChangeEvent) => {
            setCheckBoxValues({
                ...checkBoxValues,
                [property]: e.target.checked
            });
        },
        [checkBoxValues]
    );

    const onSignTask = useCallback(() => {
        const signId = currentReqData.applicationId;
        if (signId) {
            signAccessApplicationTaskById(signId)
                .then(() => {
                    const dataForUpdate = getReqDataForUpdate(
                        reqData,
                        currentReqData,
                        signId,
                        accessRequestStatuses.DONE,
                        accessRequestStatuses.ON_EMPLOYER_SIGN
                    );

                    updateReqData(dataForUpdate);
                    initAppHistory();
                    setTaskSigned(true);
                    message.success("Заявка подписана!");
                })
                .catch(() => message.error("Ошибка подписания заявки"));
        }
    }, [reqData, updateReqData, currentReqData, initAppHistory]);

    return (
        <Row className={classes.container}>
            <Row align={"middle"} justify={"space-between"} className={classes.titleContainer}>
                <Text className={classes.title}>Заявка #{currentReqData.applicationId}</Text>
            </Row>
            <Row className={classes.contentContainer}>
                <ReqCardSharedContent currentReqData={currentReqData} />
                {!taskSigned && (
                    <>
                        <Col className={classes.signTitleCol} span={24}>
                            <Text className={classes.signTitleText}>Подпишите заявку</Text>
                        </Col>
                        <Row className={classes.signContainer}>
                            <Row className={classes.fullWidth}>
                                <Checkbox
                                    value={checkBoxValues[instructionsCheckbox]}
                                    onChange={onChangeCheckbox(instructionsCheckbox)}
                                    className={classes.checkbox}
                                >
                                    С Инструкциями пользования по эксплуатации компьютерного
                                    оборудования и программного обеспечения ознакомлен и обязуюсь их
                                    выполнять*
                                </Checkbox>
                            </Row>
                            <Row className={classes.fullWidth}>
                                <Checkbox
                                    value={checkBoxValues[obligationsCheckbox]}
                                    onChange={onChangeCheckbox(obligationsCheckbox)}
                                    className={classes.checkbox}
                                >
                                    Принимаю на себя обязательство о неразглашении сведений
                                    конфиденциального характера, коммерческой тайны и сведений,
                                    отнесенных к конфиденциальной информации при предоставлении
                                    доступа к ним*
                                </Checkbox>
                            </Row>
                            <Row className={classes.fullWidth}>
                                <Checkbox
                                    value={checkBoxValues[dataCheckbox]}
                                    onChange={onChangeCheckbox(dataCheckbox)}
                                    className={classes.checkbox}
                                >
                                    Даю свое согласие на обработку моих персональных данных (в
                                    соответствии со ст. 8 Закона Республики Казахстан от 21 мая 2013
                                    года №94-V «О персональных данных и их защите»*
                                </Checkbox>
                            </Row>
                            <Row
                                className={classes.btnContainer}
                                align={"middle"}
                                justify={"center"}
                                gutter={[16, 16]}
                            >
                                <Button
                                    disabled={!trulyCheckboxValuesFlag}
                                    onClick={onSignTask}
                                    customType={"regular"}
                                >
                                    Подписать
                                </Button>
                            </Row>
                        </Row>
                    </>
                )}
            </Row>
        </Row>
    );
};
export default memo(ReqCard);
