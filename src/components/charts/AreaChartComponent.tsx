import React from 'react';
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material';
import { AreaChart, Area, XAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import tonLogo from '../../assets/kucukTON.png';
import { ChartTooltip } from './ChartTooltip';

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

// Utility function
const formatValue = (value: number): string => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

const AreaChartComponent: React.FC<AreaChartComponentProps> = ({ data, title, valueLabel, timeRange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentDayValue = data.data[data.activeDotIndex]?.value || 0;
  const formattedValue = formatValue(currentDayValue);

  return (
  
    <Box // @ts-ignore
      sx={{
        width: '100%',
        height: isMobile ? 300 : 400,
        backgroundColor: '#2f363a',
        borderRadius: 2,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
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
      </Box>

      <ResponsiveContainer>
        <AreaChart
          data={data.data}
          margin={{ top: 20, right: 8, left: 8, bottom: -2 }}
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
          <ChartTooltip title={title} valueLabel={valueLabel} formatValue={formatValue} />
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