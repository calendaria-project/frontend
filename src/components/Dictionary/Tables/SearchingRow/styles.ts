import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    wrapper: {
        marginBottom: (theme: ITheme) => theme.layout.margin
    },
    input: {
        width: (theme: ITheme) => theme.input.width,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        borderColor: (theme: ITheme) => theme.color.lines
    },
    select: {
        width: (theme: ITheme) => theme.select.width,
        marginLeft: (theme: ITheme) => theme.layout.margin,
        "& .ant-select-selector": {
            borderColor: (theme: ITheme) => `${theme.color.lines} !important`
        }
    }
});
