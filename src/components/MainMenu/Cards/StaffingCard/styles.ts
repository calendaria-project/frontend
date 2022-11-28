import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    titleWrapper: {
        width: "100%",
        marginBottom: (theme: ITheme) => theme.layout.hugeMargin
    },
    staffingTitle: {
        fontWeight: (theme: ITheme) => theme.fontWeight.primary,
        fontSize: (theme: ITheme) => theme.fontSize.title
    },
    showAll: {
        cursor: "pointer",
        color: (theme: ITheme) => theme.color.regular
    },
    contentWrapper: {
        width: "100%"
    },
    content: {
        width: "100%"
    },
    contentAmount: {},
    divider: {
        margin: "8px 0px !important"
    },
    centeredWrap: {
        width: "100%",
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
});
