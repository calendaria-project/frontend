import { Row } from "antd";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
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

    const temporaryWorkersName = "Повременщики";
    const pieceWorkersName = "Сдельщики";

    const CustomTooltip: FC = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            const percentageDep = 100 / (temporaryWorkersCount + pieceWorkersCount);
            return (
                <div className="ant-tooltip-inner">
                    {payload[0].name === temporaryWorkersName
                        ? `${Math.round(percentageDep * temporaryWorkersCount)}%`
                        : `${Math.round(percentageDep * pieceWorkersCount)}%`}
                </div>
            );
        }

        return null;
    };

    return (
        <Row className={classes.pieChartRow}>
            <div className={classes.pieChartTitle}>Сотрудники на заводе</div>
            <ResponsiveContainer width={"100%"} height={"100%"}>
                <PieChart className={classes.pieChart}>
                    <Pie
                        data={[
                            { name: pieceWorkersName, value: pieceWorkersCount ?? 0 },
                            { name: temporaryWorkersName, value: temporaryWorkersCount ?? 0 }
                        ]}
                        innerRadius={95}
                        outerRadius={110}
                        dataKey="value"
                    >
                        <Cell fill={theme.color.successful + ""} />
                        <Cell fill={theme.color.removing + ""} />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType={"circle"} verticalAlign={"bottom"} />
                </PieChart>
            </ResponsiveContainer>
        </Row>
    );
};
export default memo(PieChartCard);
