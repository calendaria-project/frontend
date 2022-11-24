import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    leftFormItem: {
        paddingRight: (theme: ITheme) => `${theme.layout.smallPadding} !important`
    },
    rightFormItem: {
        paddingLeft: (theme: ITheme) => `${theme.layout.smallPadding} !important`
    },
    okBtnFormItem: {
        marginTop: "12px !important"
    }
});
