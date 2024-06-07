import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./TopExpenses.css";

const processData = (data) => {
  // Sum expenses by category
  const categoryTotals = data.reduce((acc, item) => {
    const amount = Number(item.price) || 0;
    acc[item.category] = acc[item.category] || {
      category: item.category,
      total: 0,
    };
    acc[item.category].total += amount;
    return acc;
  }, {});

  // Sort categories by total expense and convert to array for the chart
  return Object.values(categoryTotals)
    .sort((a, b) => b.total - a.total)
    .map((cat) => ({ name: cat.category, value: cat.total }));
};

const TopExpenses = ({ data }) => {
  const processedData = processData(data);

  return (
    <div className="line-bar-chart">
      <ResponsiveContainer width="80%" height={300}>
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="value"
            barSize={20}
            radius={[0, 10, 10, 0]}
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopExpenses;
