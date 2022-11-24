import { createUseStyles } from "react-jss";

export default createUseStyles({
    pieChartTitle: {
        position: "absolute",
        fontWeight: 500,
        fontSize: "18px"
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
