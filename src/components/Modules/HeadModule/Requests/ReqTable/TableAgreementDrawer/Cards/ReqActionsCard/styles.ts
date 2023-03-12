import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    agreedText: {
        fontSize: "18px",
        color: (theme: ITheme) => theme.color.successful
    },
    cancelledText: {
        fontSize: "18px",
        color: (theme: ITheme) => theme.color.removing
    },
    btnContainer: {
        width: "100%",
        rowGap: "6px",
        marginBottom: (theme: ITheme) => theme.layout.margin
    }
});
