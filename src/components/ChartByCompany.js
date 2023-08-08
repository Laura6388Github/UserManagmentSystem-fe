import { Box, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Line,
  ComposedChart,
} from "recharts";


function CustomizedLabel({ x, y, value, width }) {
  const theme = useTheme();
  return (
    <g>
      <text
        x={x + width / 2}
        y={y - 10}
        dy={-10}
        textAnchor="middle"
        style={{
          fill: theme.palette.text.primary,
          fontSize: "1rem",
          fontWeight: "bold",
        }}
      >
        {value}
      </text>
    </g>
  );
}

const ChartByCompany = ({ data }) => {
  const [max, setMax] = useState(15000);
  const theme = useTheme();

  useEffect(() => {
    if (data) {
      const max = Math.max(...data.map((d) => d.income));
      const yMax = max > 15000 ? (Math.ceil(max / 1000) + 1) * 1000 : 15000;
      setMax(yMax);
    }
  }, [data]);

  return (
    <Box height={490}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" padding={{ left: 100, right: 100 }} />
          <YAxis domain={[0, max]} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="income"
            radius={[5, 5, 0, 0]}
            fill={theme.palette.error.dark}
            background={{ fill: theme.palette.background.default }}
            barSize={70}
          >
            <LabelList dataKey="income" content={<CustomizedLabel />} />
          </Bar>

          <Line type="monotone" dataKey="income" stroke={theme.palette.secondary.main} />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ChartByCompany;
