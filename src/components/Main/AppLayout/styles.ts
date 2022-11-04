import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    layout: {
        minHeight: "100vh"
    },
    sider: {
        background: (theme: ITheme) => theme.background.primary,
        "& .ant-layout-sider-children": {
            background: (theme: ITheme) => `${theme.background.secondary} !important`,
            borderRight: (theme: ITheme) => `${theme.border} ${theme.color.lines} !important`
        }
    },
    trigger: {
        color: (theme: ITheme) => `${theme.image.color.primary}`,
        marginTop: "auto",
        marginBottom: "auto",
        fontSize: (theme: ITheme) => `${theme.image.fontSize}`
    },
    menu: {
        background: (theme: ITheme) => theme.background.secondary,
        borderRight: "none !important",
        "& .ant-menu-item": {
            height: "50px",
            lineHeight: "55px",
            margin: "0 !important",
            "&-selected": {
                background: (theme: ITheme) => `${theme.background.regular} !important`
            }
        },
        "& .ant-menu-title-content": {
            color: (theme: ITheme) => `${theme.color.primary} !important`
        }
    },
    triggerContainer: {
        height: (theme: ITheme) => theme.layout.header.height,
        borderBottom: (theme: ITheme) => `${theme.border} ${theme.color.lines}`,
        paddingLeft: "30px",
        display: "flex",
        alignItems: "center"
    },
    icon: {
        color: (theme: ITheme) => `${theme.image.color.primary} !important`,
        fontSize: (theme: ITheme) => `${theme.image.fontSize} !important`
    },
    content: {
        background: (theme: ITheme) => theme.background.primary
    }
});
