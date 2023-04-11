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
    },
    creatorContainer: {
        width: "100%"
    },
    creatorInfoCol: {
        margin: "6px 0"
    },
    toCardText: {
        marginLeft: (theme: ITheme) => theme.layout.margin,
        color: (theme: ITheme) => theme.color.regular,
        cursor: "pointer"
    },
    titleCol: {
        marginTop: "40px",
        marginBottom: (theme: ITheme) => theme.layout.margin
    },
    titleText: {
        fontSize: "20px",
        fontWeight: (theme: ITheme) => theme.fontWeight.bold
    },
    highlightedTime: {
        color: (theme: ITheme) => theme.color.removing
    },
    aboutReqContainer: {
        width: "100%",
        flexDirection: "column"
    },
    aboutReqItemStatus: {
        color: (theme: ITheme) => theme.color.extraText
    },
    aboutReqItemContainer: {
        margin: "6px 0",
        justifyContent: "space-between"
    },
    aboutReqItemCheckbox: {
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
    statusContainer: {
        width: "fit-content",
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
    statusDivider: {
        margin: (theme: ITheme) => `0 ${theme.layout.margin}`
    }
});
