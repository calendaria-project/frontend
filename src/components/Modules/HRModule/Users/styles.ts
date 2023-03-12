import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    container: {
        padding: (theme: ITheme) => theme.layout.padding
    },
    usersTableWrapper: {
        padding: "0 !important",
        width: "100%"
    },
    searchingWrapper: {
        width: "100%",
        marginBottom: (theme: ITheme) => theme.layout.margin
    },
    searchingCol: {
        paddingLeft: "0 !important",
        paddingRight: "0 !important"
    },
    endedCol: {
        display: "flex",
        flex: "1 1 auto",
        justifyContent: "end"
    },
    selectCol: {
        marginLeft: (theme: ITheme) => theme.layout.margin
    },
    select: {
        width: (theme: ITheme) => theme.select.width,
        "& .ant-select-selector": {
            borderColor: (theme: ITheme) => `${theme.color.lines} !important`
        }
    },
    input: {
        width: (theme: ITheme) => theme.input.width
    },
    searchIcon: {
        color: (theme: ITheme) => theme.color.lines
    },
    button: {
        marginLeft: (theme: ITheme) => theme.layout.margin,
        height: (theme: ITheme) => `${theme.button.height} !important`
    }
});
