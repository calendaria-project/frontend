import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    directoryModal: {
        "& .ant-form-item": {
            marginBottom: (theme: ITheme) => `${theme.layout.margin} !important`
        },
        "& .ant-form-item-label": {
            width: "100% !important",
            minWidth: "100% !important"
        },
        "& .ant-form-item-control": {
            width: "100% !important",
            minWidth: "100% !important"
        }
    },
    leftFormItem: {
        paddingRight: (theme: ITheme) => `${theme.layout.smallPadding} !important`
    },
    rightFormItem: {
        paddingLeft: (theme: ITheme) => `${theme.layout.smallPadding} !important`
    },
    minusCol: {
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        marginTop: "18px"
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
    okBtnFormItem: {
        marginTop: "14px !important"
    },
    tabs: {
        "& .ant-tabs-nav-wrap": {
            justifyContent: "center"
        }
    }
});
