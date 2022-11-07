import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    container: {
        padding: (theme: ITheme) => theme.layout.padding,
        width: "100%"
    },
    rowWrapper: {
        width: "100%"
    },
    infoRowWrapper: {
        paddingTop: (theme: ITheme) => theme.layout.mediumPadding,
        paddingBottom: (theme: ITheme) => theme.layout.mediumPadding,
        width: "100%"
    },
    endedCol: {
        display: "flex",
        flex: "1 1 auto",
        justifyContent: "end"
    },
    mainCardCol: {
        paddingLeft: "0 !important",
        // maxHeight: "483px !important",
        paddingRight: (theme: ITheme) => theme.layout.mediumPadding
    },
    mainCard: {
        height: "100%",
        "& .ant-card-head": {
            color: (theme: ITheme) => theme.color.primary,
            background: (theme: ITheme) => theme.background.secondary
        },
        "& .ant-divider": {
            margin: "14px 0",
            borderColor: (theme: ITheme) => theme.color.lines
        },
        "& .ant-card-body": {
            padding: (theme: ITheme) => theme.layout.padding
        }
    },
    fioWrapper: {
        wordBreak: "normal"
    },
    imageWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: "20px",
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
    headerCol: {
        paddingLeft: "0 !important",
        paddingRight: (theme: ITheme) => `${theme.layout.padding} !important`
    },
    divisionCol: {
        paddingLeft: (theme: ITheme) => `${theme.layout.padding} !important`,
        paddingRight: (theme: ITheme) => `${theme.layout.padding} !important`
    },
    positionCol: {
        paddingLeft: (theme: ITheme) => `${theme.layout.padding} !important`,
        paddingRight: (theme: ITheme) => `${theme.layout.padding} !important`
    },
    archieveCol: {
        paddingRight: "0 !important"
    },
    extraInfoSpan: {
        color: (theme: ITheme) => theme.color.extraText
    },
    extraCardCol: {
        paddingRight: "0 !important",
        paddingLeft: (theme: ITheme) => theme.layout.mediumPadding
    }
});
