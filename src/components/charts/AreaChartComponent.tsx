import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  isToday?: boolean;
}

interface AreaChartComponentProps {
  data: {
    data: ChartData[];
    activeDotIndex: number;
  };
  title: string;
  valueLabel: string;
  timeRange: 'w' | 'm' | 'all';
}

const AreaChartComponent: React.FC<AreaChartComponentProps> = ({ data, title, valueLabel, timeRange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
   sx={{ 
        width: '100%', 
        height: isMobile ? 300 : 400,

        backgroundColor: '#2f363a',
        borderRadius: 2,
        position: 'relative',
      }}
    >
      <ResponsiveContainer>
        <AreaChart
          data={data.data}
        margin={{
            top: 20,
            right:8,
            left: 8,
            bottom: -2,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#36A2EB" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#36A2EB" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid horizontal={true} vertical={false} stroke="#404850" />
          <XAxis 
            dataKey="name" 
            stroke="#ffffff"
            tick={{ fill: '#ffffff', fontSize: isMobile ? 10 : 12 }}
            interval={timeRange === 'w' ? 0 : Math.floor(data.data.length / (timeRange === 'm' ? 4 : 6))}
            angle={0}
            textAnchor="middle"
            height={30}
            padding={{ left: 10, right: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#2f363a',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: '#ffffff' }}
            formatter={(value: number) => [
              `${value.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${valueLabel}`,
              title
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            name={title}
            stroke="#36A2EB"
            fill="url(#colorValue)"
            strokeWidth={2}
            dot={{ r: 0 }}
            activeDot={{ r: 6, fill: "#36A2EB", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AreaChartComponent; 