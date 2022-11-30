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
    userGroupHeaderWrap: {
        fontFamily: "Inter, sans-serif",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "20px",
        lineHeight: "30px",
        color: "#000", //из темы?
        marginLeft: "20px"
    },
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
    },
    userPhoto: {
        borderRadius: "50%"
    }
});
