import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    // @ts-ignore
    button: {
        borderColor: ({ theme }: { theme: ITheme }) => `${theme.color.lines} !important`,
        borderRadius: ({ theme }: { theme: ITheme }) => `${theme.borderRadius} !important`,
        fontWeight: ({ theme }: { theme: ITheme }) => `${theme.fontWeight.btn} !important`,
        fontSize: ({ size }: { size: "large" | "middle" | "small" | undefined }) =>
            size === "small" ? "14px !important" : "16px !important",
        "&.regular": {
            background: ({ theme, disabled }: { theme: ITheme; disabled: boolean }) =>
                !disabled ? `${theme.background.regular} !important` : "",
            color: ({ theme, disabled }: { theme: ITheme; disabled: boolean }) =>
                !disabled ? `${theme.color.primary} !important` : ""
        },
        "&.removing": {
            background: ({ theme, disabled }: { theme: ITheme; disabled: boolean }) =>
                !disabled ? `${theme.background.primary} !important` : "",
            color: ({ theme, disabled }: { theme: ITheme; disabled: boolean }) =>
                !disabled ? `${theme.color.removing} !important` : ""
        },
        "&.primary": {
            background: ({ theme, disabled }: { theme: ITheme; disabled: boolean }) =>
                !disabled ? `${theme.background.primary} !important` : "",
            color: ({ theme, disabled }: { theme: ITheme; disabled: boolean }) =>
                !disabled ? `${theme.color.secondary} !important` : ""
        }
    }
});
