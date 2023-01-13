import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    container: {
        width: "100%",
        height: "100%"
    },
    reqCard: {
        paddingRight: (theme: ITheme) => theme.layout.padding,
        height: "fit-content"
    },
    reqActions: {}
});
