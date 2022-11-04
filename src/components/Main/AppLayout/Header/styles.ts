import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    header: {
        background: (theme: ITheme) => theme.background.primary,
        borderBottom: (theme: ITheme) => `${theme.border} ${theme.color.lines}`,
        padding: (theme: ITheme) => `0 ${theme.layout.padding}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        columnGap: (theme: ITheme) => theme.layout.margin
    },
    selections: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        columnGap: (theme: ITheme) => theme.layout.margin
    },
    icon: {
        color: (theme: ITheme) => `${theme.image.color.primary} !important`,
        fontSize: (theme: ITheme) => `${theme.image.fontSize} !important`
    },
    bellIcon: {
        color: (theme: ITheme) => `${theme.image.color.regular} !important`
    },
    langSelection: {
        "& span.ant-select-arrow": {
            color: (theme: ITheme) => `${theme.color.arrow} !important`
        }
    },
    userDropdown: {},
    userDropdownInfo: {}
});
