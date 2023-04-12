import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    container: {
        height: "100%",
        width: "100%",
        flexDirection: "column",
        overflowX: "auto",
        marginBottom: (theme: ITheme) => theme.layout.margin
    },
    emptyReqWrapper: {
        marginTop: "100px"
    }
});
