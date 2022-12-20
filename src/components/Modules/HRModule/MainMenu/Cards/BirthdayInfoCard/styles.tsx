import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    questionIcon: {
        fontSize: "40px"
    },
    birthdayContentWrapper: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        margin: (theme: ITheme) => `${theme.layout.margin} 0`
    },
    birthdayTitle: {
        fontWeight: 500,
        fontSize: (theme: ITheme) => theme.fontSize.title,
        marginLeft: (theme: ITheme) => theme.layout.margin
    },
    birthdayContentInfo: {
        marginLeft: (theme: ITheme) => theme.layout.margin
    },
    birthUsersImage: {
        borderRadius: "50%"
    },
    birthDate: {
        fontSize: "14px",
        color: (theme: ITheme) => theme.color.extraText
    },
    highlightedBirthDate: {
        fontSize: "14px",
        color: (theme: ITheme) => theme.color.regular
    },
    birthdayImageCenteredWrap: {
        height: "250px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
});
