import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    container: {
        width: "100%",
        height: "100%",
        border: (theme: ITheme) => `1px solid ${theme.color.lines}`,
        borderRadius: (theme: ITheme) => theme.borderRadius
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
    creatorInfoLastCol: {
        marginTop: "40px",
        marginBottom: (theme: ITheme) => theme.layout.margin
    },
    highlightedTime: {
        color: (theme: ITheme) => theme.color.removing
    },
    describeTitle: {
        fontSize: "20px",
        fontWeight: (theme: ITheme) => theme.fontWeight.bold
    },
    aboutReqContainer: {
        width: "100%",
        flexDirection: "column"
    },
    aboutReqItemContainer: {
        margin: "6px 0",
        justifyContent: "space-between"
    },
    aboutReqItemStatus: {
        color: (theme: ITheme) => theme.color.extraText
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
    }
});
