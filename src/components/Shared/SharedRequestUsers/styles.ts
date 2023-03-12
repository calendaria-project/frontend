import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    wrapper: {
        padding: (theme: ITheme) => theme.layout.padding
    },
    selectionRow: {
        width: "100%"
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
    tableWrap: {
        marginTop: (theme: ITheme) => theme.layout.margin,
        width: "100%"
    }
});
