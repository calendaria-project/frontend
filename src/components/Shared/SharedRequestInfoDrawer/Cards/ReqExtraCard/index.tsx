import React, { FC, memo } from "react";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessApplicationHistoryViewModel
} from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { Row } from "antd";
import ReqExtraCardSharedContent from "./ReqExtraCardSharedContent";

interface IReqCard {
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
    appHistory: IAccessApplicationHistoryViewModel[];
}

const ReqCard: FC<IReqCard> = ({ currentReqData, appHistory }) => {
    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    return (
        <Row className={classes.container}>
            <ReqExtraCardSharedContent currentReqData={currentReqData} appHistory={appHistory} />
        </Row>
    );
};
export default memo(ReqCard);
