import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    rowWrapper: {
        width: "100%",
        rowGap: "6px"
    },
    endedColWrapper: {
        display: "flex",
        flex: "1 1 auto",
        justifyContent: "end"
    },
    icon: {
        position: "absolute",
        right: "6px",
        top: "4px"
    },
    extraInfo: {
        color: (theme: ITheme) => theme?.color?.extraText
    }
});
