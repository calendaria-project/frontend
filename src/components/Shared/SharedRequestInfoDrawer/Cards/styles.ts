import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    creatorContainer: {
        width: "100%"
    },
    creatorInfoCol: {
        margin: "6px 0"
    },
    highlightedTime: {
        color: (theme: ITheme) => theme.color.removing
    },
    titleCol: {
        marginTop: "40px",
        marginBottom: (theme: ITheme) => theme.layout.margin
    },
    titleText: {
        fontSize: "20px",
        fontWeight: (theme: ITheme) => theme.fontWeight.bold
    },
    aboutReqContainer: {
        width: "100%",
        flexDirection: "column"
    },
    statusContainer: {
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    statusBall: {
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        marginRight: "8px"
    },
    statusDivider: {
        margin: (theme: ITheme) => `0 ${theme.layout.margin}`
    },
    aboutReqItemStatus: {
        color: (theme: ITheme) => theme.color.extraText
    },
    aboutReqItemContainer: {
        margin: "6px 0",
        justifyContent: "space-between"
    },
    aboutReqItemCheckbox: {
        "& .ant-checkbox-disabled + span": {
            color: (theme: ITheme) => `${theme.color.default} !important`
        },
        "& .ant-checkbox-inner::after": {
            borderColor: "#f5f5f5 !important"
        },
        "& .ant-checkbox-inner": {
            border: "1px solid #d9d9d9 !important",
            backgroundColor: "#fff !important"
        },
        "& .ant-checkbox-checked .ant-checkbox-inner": {
            backgroundColor: "#1890ff !important",
            borderColor: "#1890ff !important"
        }
    }
});
