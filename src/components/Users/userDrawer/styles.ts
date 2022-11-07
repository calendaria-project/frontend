import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    userForm: {
        padding: "0 70px",
        "& .ant-typography": {
            marginBottom: 0
        },
        "& .ant-divider": {
            marginBottom: "20px"
        }
    },
    infoTitleRow: {
        marginBottom: "20px"
    },
    plusIcon: {
        color: (theme: ITheme) => theme.image.color.primary
    },
    uploadBtn: {
        color: (theme: ITheme) => theme.color.regular
    },
    deleteBtn: {
        color: (theme: ITheme) => theme.color.removing
    },
    userTitleSpace: {
        width: "100%",
        "& .ant-space-item:first-child": {
            marginBottom: "70px"
        },
        "& .ant-space-item:nth-child(2)": {
            width: "150px",
            height: "150px",
            borderRadius: "100%",
            overflow: "hidden"
        }
    },
    avatarWrap: {
        width: "150px",
        height: "150px",
        background: "#e0e0e0", //из темы?
        borderRadius: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& .anticon.anticon-plus": {
            fontSize: "34px",
            color: "#fff" //из темы?
        }
    },
    datePicker: {
        width: "100%"
    }
});
