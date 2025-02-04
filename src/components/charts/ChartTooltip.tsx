import React from 'react';
import { Tooltip } from 'recharts';

interface ChartTooltipProps {
  title: string;
  valueLabel: string;
  formatValue: (value: number) => string;
}

const tooltipContentStyle = {
  backgroundColor: '#2f363a',
  border: 'none',
  borderRadius: '8px',
  color: '#ffffff',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
} as const;

const tooltipLabelStyle = {
  color: '#ffffff'
} as const;

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ title, valueLabel, formatValue }) => {
  const tooltipFormatter = (value: number) => [
    `${formatValue(value)} ${valueLabel}`,
    title
  ];

  return (
    <Tooltip
      contentStyle={tooltipContentStyle}
      labelStyle={tooltipLabelStyle}
      formatter={tooltipFormatter}
    />
  );
}; 