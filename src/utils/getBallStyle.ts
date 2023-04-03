import { accessRequestStatuses } from "../data/enums";
import { ITheme } from "styles/theme/interface";
import {riskLevels} from "components/Modules/AdminModule/Users/userDrawer/Tabs/Roles/tempData";

export const getReqBallStyle = (theme: ITheme, status: string) => ({
    background:
        status === accessRequestStatuses.REJECTED || status === accessRequestStatuses.CANCELED
            ? theme.color.removing + ""
            : status === accessRequestStatuses.DONE
            ? theme.color.successful + ""
            : theme.color.between + ""
});

export const getRiskLevelBallStyle = (theme: ITheme, riskLevel: string) => ({
    background:
        riskLevel === riskLevels.HIGH
            ? theme.color.removing + ""
            : riskLevel === riskLevels.LOW
                ? theme.color.successful + ""
                : theme.color.between + ""
});
