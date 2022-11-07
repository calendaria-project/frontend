import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    uploadBtn: {
        color: (theme: ITheme) => theme.color.regular
    },
    deleteBtn: {
        color: (theme: ITheme) => theme.color.removing
    },
    plusIcon: {
        color: (theme: ITheme) => theme.image.color.primary
    },
    avatarIcon: {
        width: "100%"
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
    uploadItem: {
        position: "relative",
        "& button": {
            position: "absolute",
            right: 0,
            bottom: 0
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
    'signUploadInput[type="text"]': {
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingRight: "80px"
    }
});
