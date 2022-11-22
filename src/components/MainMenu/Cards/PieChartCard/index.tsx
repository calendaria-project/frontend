import { Row } from "antd";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import React, { memo } from "react";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";

const PieChartCard = () => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    return (
        <Row className={classes.pieChartRow}>
            <div className={classes.pieChartTitle}>Сотрудники на заводе</div>
            <ResponsiveContainer width={"100%"} height={"100%"}>
                <PieChart className={classes.pieChart}>
                    <Pie
                        data={[
                            { name: "Сдельщики", value: 30 },
                            { name: "Повременщики", value: 70 }
                        ]}
                        innerRadius={95}
                        outerRadius={110}
                        dataKey="value"
                    >
                        <Cell fill={theme.color.successful + ""} />
                        <Cell fill={theme.color.removing + ""} />
                    </Pie>
                    <Legend iconType={"circle"} verticalAlign={"bottom"} />
                </PieChart>
            </ResponsiveContainer>
        </Row>
    );
};
export default memo(PieChartCard);
