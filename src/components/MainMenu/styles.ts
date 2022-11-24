import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
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
    externalUserPhoto: {
        borderRadius: "50%"
    },

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
        height: "150px"
    },

    currentUserCol: {
        height: "200px"
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
        height: "400px"
    },

    pieChartCol: {
        marginTop: "-50px",
        height: "400px"
    },

    birthdayCol: {
        height: "350px"
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
        fontWeight: 500
    },
    externalUsersTitleExtra: {
        color: (theme: ITheme) => theme.color.extraText
    },
    externalUsersShowAll: {
        cursor: "pointer",
        color: (theme: ITheme) => theme.color.regular
    },
    externalUsersTableRow: {
        width: "100%",
        marginTop: (theme: ITheme) => theme.layout.hugeMargin
    }
});
