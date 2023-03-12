import { accessRequestStatuses } from "../data/enums";
import { ITheme } from "styles/theme/interface";

export const getReqBallStyle = (theme: ITheme, status: string) => ({
    background:
        status === accessRequestStatuses.REJECTED || status === accessRequestStatuses.CANCELED
            ? theme.color.removing + ""
            : status === accessRequestStatuses.DONE
            ? theme.color.successful + ""
            : theme.color.between + ""
});
