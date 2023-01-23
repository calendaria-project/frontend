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
        width: "180px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    statusBall: {
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        marginRight: "8px"
    },
    cancelIcon: {
        color: (theme: ITheme) => theme.image.color.removing,
        marginRight: "6px"
    },
    cancelText: {
        color: (theme: ITheme) => theme.color.removing
    },
    accessItemFioContainer: {
        cursor: "pointer",
        width: "150px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden"
    },
    accessItemFioImg: {
        height: "30px",
        width: "30px",
        borderRadius: "50%"
    },
    accessItemFioText: {
        marginLeft: (theme: ITheme) => theme.layout.margin
    },
    emptyDiv: {
        width: "220px"
    },
    toAccessBtn: {
        width: "220px"
    }
});
