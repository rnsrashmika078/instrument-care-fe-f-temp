import { memo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart,
} from "recharts";
import ChartCard from "./ChartCard";
import { monthlyData } from "./chartData";

export default memo(function BarChartComponent(props) {
  const keys = props.keys ?? [{ dataKey: "value", fillColor: "#f97316" }];
  const xAxisAngle = props.xAxisAngle ?? 0;
  const truncateAt = props.xAxisTruncateAt ?? 14;

  return (
    <ChartCard title={props.title ?? "Bar Chart"} subtitle={props.subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={props.data ?? monthlyData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={props.XAxisDataKey}
            tick={{ fontSize: xAxisAngle ? 10 : 11 }}
            interval={0}
            angle={xAxisAngle}
            textAnchor={xAxisAngle ? "end" : "middle"}
            height={props.xAxisHeight ?? 30}
            tickFormatter={(value) =>
              typeof value === "string" && value.length > truncateAt
                ? `${value.slice(0, truncateAt)}…`
                : value
            }
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign={props.legendVerticalAlign ?? "bottom"}
            align={props.legendAlign ?? "center"}
            wrapperStyle={{ fontSize: 12 }}
          />
          {keys.map((k, idx) => (
            <Bar
              key={idx}
              dataKey={k.dataKey}
              name={k.name ?? k.dataKey}
              fill={k.fillColor ?? "#f97316"}
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});
