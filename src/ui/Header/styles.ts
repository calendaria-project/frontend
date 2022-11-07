import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    heading: {
        "& .prefix": {
            color: (theme: ITheme) => theme.color.regular
        },
        "& .h1": {
            color: (theme: ITheme) => theme.color.mainText,
            fontSize: "28px",
            lineHeight: "34px"
        },
        "& .h2": {
            color: (theme: ITheme) => theme.color.mainText,
            fontSize: "24px",
            lineHeight: "29px"
        },
        "& .h3": {
            color: (theme: ITheme) => theme.color.mainText,
            fontSize: "18px",
            lineHeight: "22px"
        },
        "& .h4": {
            color: (theme: ITheme) => theme.color.mainText,
            fontSize: "16px",
            lineHeight: "24px"
        },
        "& .h5": {
            color: (theme: ITheme) => theme.color.mainText,
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "normal"
        }
    }
});
