import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    drawer: {
        "& .ant-drawer-body": {
            padding: ({ theme }: { theme: ITheme }) => theme.layout.padding
        },
        "& .ant-drawer-header": {
            padding: ({ theme }: { theme: ITheme }) => theme.layout.padding,
            borderBottom: "none"
        },
        "& .ant-drawer-header-title": {
            justifyContent: "end"
        },
        "& .ant-drawer-close": {
            padding: 0,
            margin: 0,
            color: ({ theme }: { theme: ITheme }) => theme.color.secondary
        }
    },
    container: {
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        height: "100%",
        minHeight: "fit-content",
        width: "100%"
    },
    centeredRequestsContainer: {
        minHeight: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    requestsContainer: {
        paddingLeft: ({ theme }: { theme: ITheme }) => `${theme.layout.padding} !important`,
        width: "40vw",
        minHeight: "100%",
        height: "fit-content",
        overflowY: "auto",

        alignSelf: "baseline"
    },
    cardContainer: {
        width: ({ theme, divisionsEquality }: { theme: ITheme; divisionsEquality: boolean }) =>
            divisionsEquality ? "20vw" : "100%",
        paddingRight: ({
            theme,
            divisionsEquality
        }: {
            theme: ITheme;
            divisionsEquality: boolean;
        }) => (divisionsEquality ? "20px" : "0"),
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",

        alignSelf: "start"
    },
    row: {
        width: "100%"
    },
    btn: {
        width: "100%"
    }
});
