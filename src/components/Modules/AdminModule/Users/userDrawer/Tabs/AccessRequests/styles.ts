import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    title: {
        fontSize: (theme: ITheme) => theme.fontSize.title,
        fontWeight: (theme: ITheme) => theme.fontWeight.bold
    },
    headerRow: {
        height: "50px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 14px",
        background: (theme: ITheme) => theme.table.header.light,
        borderRadius: (theme: ITheme) => theme.borderRadius
    },
    allReqsRow: {
        marginTop: (theme: ITheme) => theme.layout.margin,
        rowGap: (theme: ITheme) => theme.layout.mediumMargin
    },
    reqTitle: {
        width: "100%",
        marginTop: (theme: ITheme) => theme.layout.margin
    },
    onApprovementBtnContainer: {
        width: "100%"
    }
});
