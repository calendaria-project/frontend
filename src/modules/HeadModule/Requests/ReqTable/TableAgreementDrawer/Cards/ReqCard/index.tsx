import React, { FC, memo } from "react";
import { IAccessAppDataByCurrentUserInKeyViewModel } from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { Row, Typography } from "antd";
import { ITheme } from "styles/theme/interface";
import ReqCardSharedContent from "components/Requests/InfoDrawer/ReqCard/ReqCardSharedContent";

interface IReqCard {
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
    hideToCardBtnFlag?: boolean;
}

const { Text } = Typography;

const ReqCard: FC<IReqCard> = ({ currentReqData, hideToCardBtnFlag }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    return (
        <Row className={classes.container}>
            <Row align={"middle"} className={classes.titleContainer}>
                <Text className={classes.title}>Заявка #{currentReqData.applicationId}</Text>
            </Row>
            <Row className={classes.contentContainer}>
                <ReqCardSharedContent
                    currentReqData={currentReqData}
                    hideToCardBtnFlag={hideToCardBtnFlag}
                />
            </Row>
        </Row>
    );
};
export default memo(ReqCard);
