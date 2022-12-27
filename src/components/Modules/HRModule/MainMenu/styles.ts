import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    container: {
        padding: (theme: ITheme) => theme.layout.padding
    },
    infoRow: {
        width: "100%"
    },
    sharedBorderedWrapper: {
        height: "100%",
        padding: (theme: ITheme) => theme.layout.padding,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        border: (theme: ITheme) => `1px solid ${theme.color.lines}`
    },
    imageWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "30px",
        width: "30px",
        borderRadius: "50%",
        background: (theme: ITheme) => theme.background.regular
    },

    smallInfoCol: {
        height: "150px",
        paddingLeft: "0px !important"
    },

    currentUserCol: {
        height: "200px",
        paddingRight: "0px !important"
    },
    currentUserContent: {
        background: (theme: ITheme) => theme.background.regular,
        color: (theme: ITheme) => theme.color.primary,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },

    staffingCol: {
        marginTop: "-50px",
        height: "400px",
        paddingLeft: "0px !important"
    },
    staffingTitle: {
        fontWeight: (theme: ITheme) => theme.fontWeight.primary,
        fontSize: (theme: ITheme) => theme.fontSize.title
    },

    pieChartCol: {
        marginTop: "-50px",
        height: "400px"
    },

    birthdayCol: {
        height: "350px",
        paddingRight: "0px !important"
    },
    birthdayWrapper: {
        overflow: "auto"
    },

    externalUsersRow: {
        width: "100%",
        marginTop: (theme: ITheme) => theme.layout.hugeMargin
    },
    externalUsersTextWrapper: {
        width: "100%"
    },
    externalUsersTitle: {
        fontWeight: (theme: ITheme) => theme.fontWeight.primary
    },
    externalUsersTitleExtra: {
        color: (theme: ITheme) => theme.color.extraText
    },
    showAll: {
        cursor: "pointer",
        color: (theme: ITheme) => theme.color.regular
    },
    externalUsersTableRow: {
        width: "100%",
        marginTop: (theme: ITheme) => theme.layout.hugeMargin
    }
});
