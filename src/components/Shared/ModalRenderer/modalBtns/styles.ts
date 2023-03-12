import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    btnRow: {
        margin: (theme: ITheme) => theme?.layout?.btnRowMargin
    },
    modalBtns: {
        width: "100%"
    }
});
