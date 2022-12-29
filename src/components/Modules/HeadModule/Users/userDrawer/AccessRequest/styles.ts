import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    accessRequestsContainer: {
        height: "100%",
        width: "100%",
        flexDirection: "column",
        overflowX: "auto",
        marginBottom: (theme: ITheme) => theme.layout.margin
    },
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
        borderRadius: (theme: ITheme) => theme.borderRadius,
        marginTop: (theme: ITheme) => theme.layout.hugeMargin
    },
    allReqsRow: {
        marginTop: (theme: ITheme) => theme.layout.margin,
        rowGap: (theme: ITheme) => theme.layout.mediumMargin
    },
    reqTitle: {
        width: "100%",
        marginTop: (theme: ITheme) => theme.layout.margin
    },
    reqCollapseItem: {
        width: "100%",
        background: (theme: ITheme) => theme.background.primary,
        borderColor: (theme: ITheme) => theme.color.lines,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        "& .ant-collapse-item": {
            borderColor: (theme: ITheme) => theme.color.lines
        }
    },
    accessItemContainer: {
        margin: "8px 0px",
        justifyContent: "space-between"
    },
    accessItemStatus: {
        color: (theme: ITheme) => theme.color.extraText
    },
    accessItemCheckbox: {
        "& .ant-checkbox-disabled + span": {
            color: (theme: ITheme) => `${theme.color.default} !important`
        },
        "& .ant-checkbox-inner::after": {
            borderColor: "#f5f5f5 !important"
        },
        "& .ant-checkbox-inner": {
            border: "1px solid #d9d9d9 !important",
            backgroundColor: "#fff !important"
        },
        "& .ant-checkbox-checked .ant-checkbox-inner": {
            backgroundColor: "#1890ff !important",
            borderColor: "#1890ff !important"
        }
    },
    panelContainer: { justifyContent: "space-between", alignItems: "center", width: "100%" },
    panelStatusContainer: {
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    panelStatusBall: {
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        marginRight: "8px"
    }
});
