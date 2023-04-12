import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    select: {
        width: (theme: ITheme) => theme.select.width,
        marginLeft: (theme: ITheme) => theme.layout.margin,
        "& .ant-select-selector": {
            borderColor: (theme: ITheme) => `${theme.color.lines} !important`
        }
    },
    button: {
        marginLeft: (theme: ITheme) => theme.layout.margin,
        height: (theme: ITheme) => `${theme.button.height} !important`
    },
    selectionWrapper: {
        display: "flex",
        alignItems: "baseline"
    }
});
