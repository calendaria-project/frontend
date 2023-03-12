import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    row: {
        padding: (theme: ITheme) => theme.layout.padding
    }
});
