import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    leftFormItem: {
        paddingRight: (theme: ITheme) => `${theme.layout.smallPadding} !important`
    },
    rightFormItem: {
        paddingLeft: (theme: ITheme) => `${theme.layout.smallPadding} !important`
    },
    minusCol: {
        display: "flex",
        justifyContent: "end",
        marginTop: "-20px"
    },
    plusCol: {
        marginTop: "-8px"
    },
    minusBtnIcon: {
        color: (theme: ITheme) => `${theme.color.removing} !important`
    },
    plusBtnIcon: {
        color: (theme: ITheme) => `${theme.color.successful} !important`
    },
    tabs: {
        "& .ant-tabs-nav-wrap": {
            justifyContent: "center"
        }
    },
    addressLabel: {
        marginBottom: "10px"
    }
});
