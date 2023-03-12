import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    titleItem: {
        fontSize: (theme: ITheme) => theme?.fontSize?.title
    },
    errorMsg: {
        padding: "0 !important",
        fontSize: (theme: ITheme) => theme?.fontSize?.description,
        color: (theme: ITheme) => theme?.color?.removing
    },
    errArrWrapper: {
        width: "100%",
        margin: "16px 0 24px 0 !important",
        padding: "0px 8px !important"
    },
    errItem: {
        width: "100%"
    },
    errItemTitle: {
        color: (theme: ITheme) => theme?.color?.extraText
    },
    errItemAdd: {
        cursor: "pointer",
        color: (theme: ITheme) => theme?.color?.regular
    }
});
