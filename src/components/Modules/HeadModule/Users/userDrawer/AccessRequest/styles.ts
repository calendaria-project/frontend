import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    requestsContainer: {
        height: "100%",
        width: "100%",
        flexDirection: "column"
    },
    title: {
        fontSize: (theme: ITheme) => theme.fontSize.title,
        fontWeight: (theme: ITheme) => theme.fontWeight.bold
    },
    headerCol: {
        height: "50px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 14px",
        background: (theme: ITheme) => theme.table.header.light,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        marginTop: (theme: ITheme) => theme.layout.hugeMargin
    }
});
