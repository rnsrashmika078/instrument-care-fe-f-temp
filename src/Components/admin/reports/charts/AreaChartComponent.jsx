import { memo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
} from "recharts";
import ChartCard from "./ChartCard";
import { monthlyData } from "./chartData";

export default memo(function AreaChartComponent(props) {
  const keys = props.keys ?? [
    { dataKey: "users", strokeColor: "#f97316", fillColor: "#fed7aa" },
  ];

  return (
    <ChartCard title={props.title ?? "Area Chart"} subtitle={props.subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={props.data ?? monthlyData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={props.XAxisDataKey ?? "month"}
            tick={{ fontSize: 11 }}
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
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {keys.map((k, idx) => (
            <Area
              key={idx}
              type="monotone"
              dataKey={k.dataKey}
              name={k.name ?? k.dataKey}
              stroke={k.strokeColor ?? "#f97316"}
              fill={k.fillColor ?? "#fed7aa"}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});
