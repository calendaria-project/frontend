import { FC, memo } from "react";
import { IAccessAppDataByCurrentUserInKeyViewModel } from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";

interface IReqCard {
    reqData: IAccessAppDataByCurrentUserInKeyViewModel;
}

const ReqActionsCard: FC<IReqCard> = ({ reqData }) => {
    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    console.log(reqData);

    return <></>;
};
export default memo(ReqActionsCard);
