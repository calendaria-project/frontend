import { Row } from "antd";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import React, { memo, FC } from "react";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";

interface IPieChartCard {
    temporaryWorkersCount: number;
    pieceWorkersCount: number;
}

const PieChartCard: FC<IPieChartCard> = ({ temporaryWorkersCount, pieceWorkersCount }) => {
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
                            { name: "Сдельщики", value: pieceWorkersCount ?? 0 },
                            { name: "Повременщики", value: temporaryWorkersCount ?? 0 }
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
