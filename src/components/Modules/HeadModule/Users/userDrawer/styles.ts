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
        width: "100%"
    },
    requestsContainer: {
        paddingLeft: ({ theme }: { theme: ITheme }) => `${theme.layout.padding} !important`,
        width: "40vw",
        height: "100%"
    },
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
    cardContainer: {
        width: ({ theme, divisionsEquality }: { theme: ITheme; divisionsEquality: boolean }) =>
            divisionsEquality ? "20vw" : "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    row: {
        width: "100%"
    },
    imageWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        "& > .anticon svg": {
            color: ({ theme }: { theme: ITheme }) => theme.color.lines,
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
        marginTop: ({ theme }: { theme: ITheme }) => theme.layout.margin
    },
    sharedColWrapper: {
        marginTop: "8px",
        padding: "10px",
        border: ({ theme }: { theme: ITheme }) => `1px solid ${theme.color.lines}`,
        borderRadius: ({ theme }: { theme: ITheme }) => theme.borderRadius
    },
    phoneWrapper: {
        marginTop: ({ theme }: { theme: ITheme }) => theme.layout.hugeMargin
    },
    icon: {
        color: ({ theme }: { theme: ITheme }) => theme.image.color.regular,
        margin: "0 10px"
    },
    disabledIcon: {
        color: ({ theme }: { theme: ITheme }) => theme.color.lines,
        margin: "0 10px"
    },
    btn: {
        width: "100%"
    },
    createBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 40px !important"
    }
});
