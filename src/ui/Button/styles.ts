import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    button: {
        borderColor: (theme: ITheme) => `${theme.color.lines} !important`,
        borderRadius: (theme: ITheme) => `${theme.borderRadius} !important`,
        fontWeight: (theme: ITheme) => `${theme.fontWeight.btn} !important`,
        "&.regular": {
            background: (theme: ITheme) => `${theme.background.regular} !important`,
            color: (theme: ITheme) => `${theme.color.primary} !important`
        },
        "&.removing": {
            background: (theme: ITheme) => `${theme.background.primary} !important`,
            color: (theme: ITheme) => `${theme.color.removing} !important`
        },
        "&.primary": {
            background: (theme: ITheme) => `${theme.background.primary} !important`,
            color: (theme: ITheme) => `${theme.color.secondary} !important`
        }
    }
});
