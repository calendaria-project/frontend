import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    drawer: {
        "& .ant-drawer-body": {
            padding: (theme: ITheme) => theme.layout.padding
        },
        "& .ant-drawer-header": {
            padding: (theme: ITheme) => theme.layout.padding,
            borderBottom: "none"
        },
        "& .ant-drawer-header-title": {
            justifyContent: "end"
        },
        "& .ant-drawer-close": {
            padding: 0,
            margin: 0,
            color: (theme: ITheme) => theme.color.secondary
        }
    },
    container: {
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    row: {
        width: "100%"
    },
    imageWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        "& > .anticon svg": {
            color: (theme: ITheme) => theme.color.lines,
            height: "100px",
            width: "100px"
        }
    },
    userImage: {
        borderRadius: "50%"
    },
    textWrapper: {
        display: "flex",
        justifyContent: "center",
        marginTop: (theme: ITheme) => theme.layout.margin
    },
    sharedColWrapper: {
        marginTop: "8px",
        padding: "10px",
        border: (theme: ITheme) => `1px solid ${theme.color.lines}`,
        borderRadius: (theme: ITheme) => theme.borderRadius
    },
    phoneWrapper: {
        marginTop: (theme: ITheme) => theme.layout.hugeMargin
    },
    icon: {
        color: (theme: ITheme) => theme.image.color.regular,
        margin: "0 10px"
    },
    disabledIcon: {
        color: (theme: ITheme) => theme.color.lines,
        margin: "0 10px"
    }
});
