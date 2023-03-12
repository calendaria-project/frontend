import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    space: {
        width: "100%",
        "& .ant-space-item": {
            width: "100%"
        }
    },
    uploadBtn: {
        width: "100%",
        pointerEvents: "none"
    },
    emptyBtn: {
        border: (theme: ITheme) => `1px solid ${theme.color.successful}`,
        color: (theme: ITheme) => `${theme.color.primary} !important`,
        background: (theme: ITheme) => theme.color.successful
    },
    withFileBtn: {
        background: (theme: ITheme) => theme.background.primary,
        color: (theme: ITheme) => `${theme.color.successful} !important`,
        border: (theme: ITheme) => `1px solid ${theme.color.successful}`
    },
    uploadBtnEmptyContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px"
    }
});
