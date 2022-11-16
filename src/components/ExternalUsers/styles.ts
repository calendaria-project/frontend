import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    wrapper: {
        padding: (theme: ITheme) => theme.layout.padding
    },
    selectionRow: {
        width: "100%"
    },
    select: {
        width: (theme: ITheme) => theme.select.width,
        "& .ant-select-selector": {
            borderColor: (theme: ITheme) => `${theme.color.lines} !important`
        }
    },
    sortSelect: {
        marginLeft: (theme: ITheme) => theme.layout.smallMargin
    },
    sortText: {
        marginLeft: (theme: ITheme) => theme.layout.hugeMargin,
        fontSize: "14px",
        color: (theme: ITheme) => theme.color.extraText
    },
    input: {
        width: (theme: ITheme) => theme.input.width,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        borderColor: (theme: ITheme) => theme.color.lines,
        marginRight: (theme: ITheme) => theme.layout.margin
    },
    suffix: {
        color: (theme: ITheme) => theme.color.lines
    },
    btn: {
        height: "34px !important"
    },
    externalUsersRow: {},
    fullNameWrap: {
        display: "flex",
        alignItems: "center",
        rowGap: "6px",
        flexDirection: "row"
    },
    fullNameText: {
        cursor: "pointer",
        marginLeft: (theme: ITheme) => theme.layout.margin,
        color: (theme: ITheme) => theme.color.mainText,
        overflow: "hidden !important",
        textOverflow: "ellipsis !important"
    },
    externalUserPhoto: {
        borderRadius: "50%"
    },
    externalUsersTableWrap: {
        marginTop: (theme: ITheme) => theme.layout.margin,
        width: "100%"
    }
});
