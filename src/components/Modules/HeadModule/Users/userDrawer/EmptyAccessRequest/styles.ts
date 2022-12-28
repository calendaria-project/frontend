import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    emptyRequestsContainer: {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    emptyRequests: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        rowGap: ({ theme }: { theme: ITheme }) => theme.layout.margin
    },
    emptyRequestsText: {
        textAlign: "center",
        fontWeight: ({ theme }: { theme: ITheme }) => theme.fontWeight.bold,
        fontSize: ({ theme }: { theme: ITheme }) => theme.fontSize.title
    },
    createBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 40px !important"
    }
});
