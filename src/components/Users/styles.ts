import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    usersTable: {
        ".tabulator": {
            ".tabulator-header": {
                backgroundColor: "#fff !important"
            }
        }
    },
    userGroupHeaderWrap: {
        fontFamily: "Inter, sans-serif",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "20px",
        lineHeight: "30px",
        color: "#000", //из темы?
        marginLeft: "20px"
    },
    searchingWrapper: {
        marginBottom: (theme: ITheme) => theme.layout.margin
    },
    input: {
        width: (theme: ITheme) => theme.input.width,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        borderColor: (theme: ITheme) => theme.color.lines
    },
    searchIcon: {
        color: (theme: ITheme) => theme.color.lines
    },
    button: {
        marginLeft: (theme: ITheme) => theme.layout.margin,
        height: (theme: ITheme) => `${theme.button.height} !important`
    }
});
