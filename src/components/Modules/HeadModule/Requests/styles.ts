import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    wrapper: {
        padding: (theme: ITheme) => theme.layout.padding
    },
    selectionRow: {
        width: "100%"
    },
    textForSelection: {
        marginLeft: (theme: ITheme) => theme.layout.hugeMargin,
        fontSize: "14px",
        color: (theme: ITheme) => theme.color.extraText
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
    input: {
        marginRight: (theme: ITheme) => theme.layout.margin,
        width: (theme: ITheme) => theme.input.width,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        borderColor: (theme: ITheme) => theme.color.lines
    },
    suffix: {
        color: (theme: ITheme) => theme.color.lines
    },
    btn: {
        background: (theme: ITheme) => theme.button.colors.regular,
        color: (theme: ITheme) => theme.color.primary
    },
    loadIconWrap: {
        marginTop: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "center"
    }
});
