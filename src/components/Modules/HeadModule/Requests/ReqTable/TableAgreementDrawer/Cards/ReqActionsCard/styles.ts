import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    container: {},
    agreedText: {
        fontSize: "18px",
        color: (theme: ITheme) => theme.color.successful
    },
    cancelledText: {
        fontSize: "18px",
        color: (theme: ITheme) => theme.color.removing
    },
    btnContainer: {
        width: "100%",
        rowGap: "6px",
        marginBottom: (theme: ITheme) => theme.layout.margin
    },
    sectionContainer: {
        width: "100%",
        border: (theme: ITheme) => `1px solid ${theme.color.lines}`,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        marginBottom: (theme: ITheme) => theme.layout.margin,
        overflow: "auto"
    },
    titleContainer: {
        width: "100%",
        borderTopLeftRadius: (theme: ITheme) => theme.borderRadius,
        borderTopRightRadius: (theme: ITheme) => theme.borderRadius,
        height: "50px",
        padding: (theme: ITheme) => `0 ${theme.layout.padding}`,
        background: (theme: ITheme) => theme.table.header.light
    },
    innerSectionContainer: {
        width: "100%",
        padding: (theme: ITheme) => theme.layout.padding,
        alignItems: "center"
    },
    img: {
        marginRight: (theme: ITheme) => theme.layout.margin,
        borderRadius: "50%"
    },
    textCol: {
        marginTop: (theme: ITheme) => theme.layout.margin
    },
    extraText: {
        fontSize: "12px",
        color: (theme: ITheme) => theme.color.extraText
    },
    statusBallContainer: {
        display: "flex",
        alignItems: "center"
    },
    statusBall: {
        height: "16px",
        width: "16px",
        borderRadius: "50%",
        marginRight: (theme: ITheme) => theme.layout.margin
    },
    histRow: {
        width: "100%",
        flexDirection: "column"
    },
    histArrow: {
        margin: (theme: ITheme) => `${theme.layout.margin} 0`
    }
});
