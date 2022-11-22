import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    questionIcon: {
        fontSize: "40px"
    },
    fullNameWrapper: {
        fontSize: "18px",
        wordBreak: "normal",
        marginLeft: (theme: ITheme) => theme.layout.margin
    },
    userInfoName: {
        fontWeight: 600
    },
    userInfoValue: {
        marginLeft: (theme: ITheme) => theme.layout.mediumMargin
    }
});
