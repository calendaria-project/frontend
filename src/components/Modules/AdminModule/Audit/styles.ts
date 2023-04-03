import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    container: {
        padding: (theme: ITheme) => theme.layout.padding
    },
    selectionRow: {
        width: "100%"
    },
    select: {
        width: (theme: ITheme) => theme.select.width,
        marginLeft: (theme: ITheme) => theme.layout.margin,
        "& .ant-select-selector": {
            borderColor: (theme: ITheme) => `${theme.color.lines} !important`
        }
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
    button: {
        height: (theme: ITheme) => `${theme.button.height} !important`
    }
});
