import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    extraCard: {
        height: "100%",
        "& .ant-card-head": {
            color: (theme: ITheme) => theme.color.secondary,
            background: (theme: ITheme) => theme.background.secondary
        },
        "& .ant-divider": {
            margin: "8px 0",
            borderColor: (theme: ITheme) => theme.color.lines
        },
        "& .ant-card-body": {
            padding: (theme: ITheme) => theme.layout.padding
        },
        "& li.ant-menu-item, &__extraCard .ant-menu-submenu-title": {
            height: "34px !important",
            paddingLeft: "6px !important",
            paddingRight: "40px !important"
        },
        "& .ant-menu-title-content": {
            color: (theme: ITheme) => `${theme.color.secondary} !important`,
            marginLeft: "6px !important"
        },
        "& .anticon": {
            color: (theme: ITheme) => `${theme.image.color.regular} !important`
        },
        "& li.ant-menu-item.ant-menu-item-selected": {
            background: (theme: ITheme) => `${theme.selection.background.transparency} !important`
        },
        "& .ant-menu-item-selected::after": {
            display: "none"
        }
    },
    icon: {
        position: "absolute",
        right: "6px"
    },
    rowDataContainer: {
        paddingLeft: (theme: ITheme) => theme.layout.padding
    }
});
