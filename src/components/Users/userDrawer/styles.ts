import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    row: {
        width: "100%"
    },
    imageWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        "& > .anticon svg": {
            color: (theme: ITheme) => theme.color.lines,
            height: "100px",
            width: "100px"
        }
    },
    userImage: {
        borderRadius: "50%"
    },
    textWrapper: {
        display: "flex",
        justifyContent: "center",
        marginTop: (theme: ITheme) => theme.layout.margin
    },
    sharedColWrapper: {
        marginTop: "8px",
        padding: "10px",
        border: (theme: ITheme) => `1px solid ${theme.color.lines}`,
        borderRadius: (theme: ITheme) => theme.borderRadius
    },
    phoneWrapper: {
        marginTop: (theme: ITheme) => theme.layout.hugeMargin
    },
    icon: {
        color: (theme: ITheme) => theme.image.color.regular,
        margin: "0 10px"
    },
    disabledIcon: {
        color: (theme: ITheme) => theme.color.lines,
        margin: "0 10px"
    },
    btnContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        width: "100%",
        gap: (theme: ITheme) => theme.layout.margin
    },
    btn: {
        width: "100%",
        "&[disabled]": {
            pointerEvents: "none"
        }
    },
    dropDownBtn: {
        background: (theme: ITheme) => theme.button.colors.regular,
        color: (theme: ITheme) => theme.color.primary
    },
    divisionsEqualMsg: {
        color: (theme: ITheme) => theme.color.removing
    }
});
