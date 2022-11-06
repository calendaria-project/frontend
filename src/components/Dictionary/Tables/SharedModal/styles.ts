import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    leftFormItem: {
        paddingRight: (theme: ITheme) => `${theme.layout.smallPadding} !important`
    },
    rightFormItem: {
        paddingLeft: (theme: ITheme) => `${theme.layout.smallPadding} !important`
    },
    btnFormItem: {
        display: "flex",
        justifyContent: "center",
        marginTop: (theme: ITheme) => `${theme.layout.margin} !important`
    }
});
