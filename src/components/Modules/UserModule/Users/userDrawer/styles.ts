import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    drawer: {
        "& .ant-drawer-body": {
            padding: (theme: ITheme) => theme.layout.padding
        },
        "& .ant-drawer-header": {
            padding: (theme: ITheme) => theme.layout.padding,
            borderBottom: "none"
        },
        "& .ant-drawer-header-title": {
            justifyContent: "end"
        },
        "& .ant-drawer-close": {
            padding: 0,
            margin: 0,
            color: (theme: ITheme) => theme.color.secondary
        }
    },
    container: {
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between"
    }
});
