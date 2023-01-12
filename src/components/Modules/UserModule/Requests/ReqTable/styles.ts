import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    wrapper: {
        height: "100%",
        width: "100%",
        flexDirection: "column",
        overflowX: "auto",
        margin: (theme: ITheme) => `${theme.layout.margin} 0`
    },
    headerRow: {
        height: "61px",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        padding: "0 14px",
        background: (theme: ITheme) => theme.table.header.light,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        columnGap: "14px"
    },
    headerText: {
        fontSize: "20px",
        whiteSpace: "nowrap"
    },
    reqTitleText: {
        fontSize: "20px",
        fontWeight: (theme: ITheme) => theme.fontWeight.bold
    },
    reqTypeText: {
        width: "150px"
    },
    allReqsRow: {
        marginTop: (theme: ITheme) => theme.layout.margin,
        rowGap: (theme: ITheme) => theme.layout.mediumMargin
    },
    reqTitle: {
        width: "100%",
        marginTop: (theme: ITheme) => theme.layout.margin
    },
    reqContainer: {
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        height: "50px",
        padding: "0 14px",
        border: (theme: ITheme) => `1px solid ${theme.color.lines}`,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        flexWrap: "nowrap",
        columnGap: "14px",
        whiteSpace: "nowrap"
    },
    statusContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "180px"
    },
    statusBall: {
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        marginRight: "8px"
    },
    cancelReqTextContainer: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        width: "160px"
    },
    cancelIcon: {
        color: (theme: ITheme) => theme.image.color.removing,
        marginRight: "6px"
    },
    cancelText: {
        color: (theme: ITheme) => theme.color.removing
    },
    emptyDiv: {
        width: "160px"
    }
});
