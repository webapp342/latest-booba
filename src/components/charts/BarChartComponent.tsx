import React from 'react';
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import tonLogo from '../../assets/kucukTON.png';

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

  // Format values
  const formatValue = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Get current day's value
  const currentDayValue = data.data[data.activeDotIndex]?.value || 0;
  const formattedValue = formatValue(currentDayValue);

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
      {/* Overlay Text */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          component="img"
          src={tonLogo}
          alt="TON"
          sx={{
            width: 20,
            height: 20,
            objectFit: 'contain',
          }}
        />
        <Typography
          sx={{
            color: '#ffffff',
            fontSize: '1.1rem',
            fontWeight: 600,
            opacity: 0.9,
            textShadow: '0px 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          {formattedValue} {valueLabel}
        </Typography>
      </Box>

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
              `${formatValue(value)} ${valueLabel}`,
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