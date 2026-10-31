import { memo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import ChartCard from "./ChartCard";
import { monthlyData } from "./chartData";

export default memo(function LineChartComponent(props) {
  const keys = props.keys ?? [
    { dataKey: "users", strokeColor: "#f97316" },
    { dataKey: "sales", strokeColor: "#16a34a" },
  ];

  return (
    <ChartCard title={props.title ?? "Line Chart"} subtitle={props.subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={props.data ?? monthlyData}>
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
            <Line
              key={idx}
              type="monotone"
              dataKey={k.dataKey}
              name={k.name ?? k.dataKey}
              stroke={k.strokeColor ?? "#f97316"}
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});
