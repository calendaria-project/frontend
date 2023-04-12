import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    headerRow: {
        height: "50px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 14px",
        background: (theme: ITheme) => theme.table.header.light,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        marginTop: (theme: ITheme) => theme.layout.margin
    },
    btnContainer: {
        gap: (theme: ITheme) => theme.layout.margin,
        flexWrap: "wrap"
    },
    tempItem: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        border: (theme: ITheme) => `1px solid ${theme.color.lines}`,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        padding: "12px 16px",
        marginTop: (theme: ITheme) => theme.layout.mediumMargin
    },
    tempItemName: {
        width: "140px",
        color: (theme: ITheme) => theme.color.regular
    },
    statusContainer: {
        width: "140px",
        display: "flex",
        alignItems: "center",
        justifyContent: "start"
    },
    statusBall: {
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        marginRight: "8px"
    }
});
