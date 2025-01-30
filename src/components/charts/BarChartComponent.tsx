import React, {  } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  isToday?: boolean;
}

interface BarChartComponentProps {
  data: {
    data: ChartData[];
    activeDotIndex: number;
  };
  title: string;
  valueLabel: string;
  timeRange: 'w' | 'm' | 'all';
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, title, valueLabel, timeRange }) => {
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
        <BarChart
          data={data.data}
          margin={{
            top: 20,
            right: 5,
            left: 5,
            bottom: -2,
          }}
        >
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
          <Bar
            dataKey="value"
            name={title}
            fill="#64B5F6"
            radius={[4, 4, 0, 0]}
            maxBarSize={timeRange === 'w' ? 50 : Math.max(40 / data.data.length, 5)}
          >
            {data.data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === data.activeDotIndex ? '#36A2EB' : '#64B5F6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartComponent; 