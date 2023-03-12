import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    container: {
        width: "100%",
        height: "100%",
        border: (theme: ITheme) => `1px solid ${theme.color.lines}`,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        overflow: "auto"
    },
    titleContainer: {
        background: (theme: ITheme) => theme.background.secondary,
        width: "100%",
        height: "50px",
        padding: (theme: ITheme) => `0 ${theme.layout.padding}`,
        borderTopLeftRadius: (theme: ITheme) => theme.borderRadius,
        borderTopRightRadius: (theme: ITheme) => theme.borderRadius
    },
    title: {
        color: (theme: ITheme) => theme.color.primary,
        fontWeight: (theme: ITheme) => theme.fontWeight.bold
    },
    contentContainer: {
        padding: (theme: ITheme) => theme.layout.padding,
        width: "100%",
        height: "100%"
    }
});
