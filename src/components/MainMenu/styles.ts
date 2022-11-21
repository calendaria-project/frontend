import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    container: {
        padding: (theme: ITheme) => theme.layout.padding
    },
    infoRow: {
        width: "100%"
    },
    externalUsersRow: {
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
    smallInfoContent: {
        background: (theme: ITheme) => theme.background.highlight
    },
    primaryCardInfo: {
        display: "flex",
        alignItems: "end"
    },
    secondaryCardInfo: {
        fontSize: "26px",
        color: (theme: ITheme) => theme.color.regular
    },

    currentUserCol: {
        height: "200px"
    },
    currentUserContent: {
        background: (theme: ITheme) => theme.background.regular,
        color: (theme: ITheme) => theme.color.primary
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
    externalUsersText: {
        width: "100%"
    },
    externalUsersTableRow: {
        width: "100%"
    }
});
