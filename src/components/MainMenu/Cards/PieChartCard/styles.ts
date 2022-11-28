import { createUseStyles } from "react-jss";
import { ITheme } from "../../../../styles/theme/interface";

export default createUseStyles({
    pieChartTitle: {
        position: "absolute",
        fontWeight: 500,
        fontSize: (theme: ITheme) => theme.fontSize.title
    },
    pieChartRow: {
        height: "100%"
    },
    pieChart: {
        "& .recharts-legend-item-text": {
            fontSize: "14px !important"
        },
        "& .recharts-default-legend > li:last-child": {
            marginRight: "0 !important"
        }
    }
});
