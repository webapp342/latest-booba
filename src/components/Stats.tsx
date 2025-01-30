import React, { useState, useMemo } from 'react';
import { Grid, Typography, Box, useTheme, useMediaQuery, ToggleButtonGroup, ToggleButton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PoolStats from './poolstats';
import Brand from './AiYield';
import AreaChartComponent from './charts/AreaChartComponent';
import BarChartComponent from './charts/BarChartComponent';
import "./text.css";
import Dashboard from './Dashboard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

interface StatsProps {
  totalLockedTon: number;
  totalEarningsDistributed: number;
  totalPools: number;
  performanceData: number[];
}

const Stats: React.FC<StatsProps> = ({
  totalPools,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [chartType, setChartType] = useState<'tvl' | 'earnings'>('tvl');
  const [timeRange, setTimeRange] = useState<'w' | 'm' | 'all'>('all');

  // Get current UTC date
  const currentUTCDate = new Date();
  const startDate = new Date(currentUTCDate);
  startDate.setUTCDate(currentUTCDate.getUTCDate() - 47); // Start from 48 days ago

  // Generate continuous data starting from 48 days ago
  const generateContinuousData = () => {
    const data = [];
    const baseDate = new Date(startDate);

    for (let i = 0; i < 48; i++) {
      const currentDate = new Date(baseDate);
      currentDate.setUTCDate(baseDate.getUTCDate() + i);

      // TVL data: Starts from 1.2M and gradually increases with some randomness
      const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const tvlBase = 1200000 + (daysPassed * 50000);
      const tvlRandom = Math.random() * 100000;
      const tvlValue = Math.round(tvlBase + tvlRandom);

      // Earnings data: Starts from 50K and gradually increases with some randomness
      const earningsBase = 50000 + (daysPassed * 2000);
      const earningsRandom = Math.random() * 5000;
      const earningsValue = Math.round(earningsBase + earningsRandom);

      data.push({
        date: currentDate,
        tvl: tvlValue,
        earnings: earningsValue
      });
    }
    return data;
  };

  // Generate and memoize the continuous data
  const continuousData = useMemo(() => generateContinuousData(), []);

  // Find today's index in the data
  const findTodayIndex = (data: { date: Date; tvl: number; earnings: number; }[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for date comparison

    // Find the index of the date closest to today
    return data.findIndex(item => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() === today.getTime();
    });
  };

  // Convert continuous data to chart format
  const chartData = useMemo(() => {
    const todayIndex = findTodayIndex(continuousData);
    return continuousData.map((data, index) => ({
      name: data.date.toLocaleDateString('en-GB', { 
        day: '2-digit',
        month: 'short',
        timeZone: 'UTC'
      }),
      value: chartType === 'tvl' ? data.tvl : data.earnings,
      isToday: index === todayIndex
    }));
  }, [continuousData, chartType]);

  const getDisplayData = () => {
    const totalDays = chartData.length;
    let result;
    
    switch (timeRange) {
      case 'w':
        result = chartData.slice(totalDays - 7);
        break;
      case 'm':
        result = chartData.slice(totalDays - 30);
        break;
      case 'all':
        result = chartData;
        break;
      default:
        result = chartData.slice(totalDays - 7);
    }

    // Find today's index in the sliced data
    const todayIndex = result.findIndex(item => item.isToday);
    return {
      data: result,
      activeDotIndex: todayIndex >= 0 ? todayIndex : result.length - 1
    };
  };

  const handleChartTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newChartType: 'tvl' | 'earnings',
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const handleTimeRangeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTimeRange: 'w' | 'm' | 'all',
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };


    const dashboardData = {
    tvl: {
      value: '7.63M',
      change: 2.53,
    },
    volume: {
      value: '$ 51.16B',
      change: -18.90,
    },
    openInterest: {
      value: '$ 1.76M',
      change: -41.89,
    },
    totalEarning: {
      value: '$ 18.82M',
      change: 0.14,
    },
    users: {
      value: '162K',
      change: 0.00,
    },
  };

  return (
   
    <Box sx={{ padding: '16px', marginTop: 6, marginBottom: 14, backgroundColor: '#1a2126', borderRadius: 2}}>
      <Brand/>

                                               <Dashboard data={dashboardData} />

                                

      {/* Chart Section */}
      <Box sx={{ mt: 8}}>
        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Grid item xs>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, rgba(54, 162, 235, 0.1), rgba(77, 201, 255, 0.1))',
                  borderRadius: '8px',
                  p: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid rgba(54, 162, 235, 0.2)',
                }}
              >
                <TrendingUpIcon sx={{ 
                  color: '#36A2EB',
                  fontSize: { xs: '1.2rem', sm: '1.4rem' }
                }} />
              </Box>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '1.3rem' },
                    color: '#fff',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    mb: 0.2
                  }}
                >
                  Performance Analytics
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#6B7280',
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box component="span" sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    backgroundColor: '#4CAF50',
                    display: 'inline-block'
                  }} />
                  Real-time Market Overview
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: '#2f363a', 
          borderRadius: 2,
          width: '100%',
          overflow: 'hidden'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            px: 2,
            pt: 2
          }}>
          
            <Box>
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartTypeChange}
                aria-label="chart type"
                size={isMobile ? "small" : "medium"}
                sx={{
                  backgroundColor: 'transparent',
                  '& .MuiToggleButton-root': {
                    color: '#ffffff',
                    border: 'none',
                    padding: '4px 8px',
                    '&.Mui-selected': {
                      backgroundColor: '#36A2EB',
                      color: '#ffffff',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <ToggleButton value="tvl" aria-label="TVL">
                  TVL
                </ToggleButton>
                <ToggleButton value="earnings" aria-label="Total Earnings">
                  Total Earnings
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box>
              <ToggleButtonGroup
                value={timeRange}
                exclusive
                onChange={handleTimeRangeChange}
                aria-label="time range"
                size={isMobile ? "small" : "medium"}
                sx={{
                  backgroundColor: 'transparent',
                  '& .MuiToggleButton-root': {
                    color: '#ffffff',
                    border: 'none',
                    padding: '4px 8px',
                    minWidth: '40px',
                    '&.Mui-selected': {
                      backgroundColor: '#36A2EB',
                      color: '#ffffff',
                      borderRadius: '8px',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    },
                  },
                }}
              >
                <ToggleButton value="w" aria-label="Week">
                  W
                </ToggleButton>
                <ToggleButton value="m" aria-label="Month">
                  M
                </ToggleButton>
                <ToggleButton value="all" aria-label="All">
                  ALL
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          <Box sx={{ width: '100%' }}>
            {chartType === 'tvl' ? (
              <AreaChartComponent
                data={getDisplayData()}
                title="Total Value Locked"
                valueLabel="TON"
                timeRange={timeRange}
              />
            ) : (
              <BarChartComponent
                data={getDisplayData()}
                title="Total Earnings"
                valueLabel="TON"
                timeRange={timeRange}
              />
            )}
          </Box>
        </Box>
      </Box>

  <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: 6, mb:1 }}>
    <Grid item xs>
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(54, 162, 235, 0.1), rgba(77, 201, 255, 0.1))',
            borderRadius: '8px',
            p: 0.8,
            display: 'flex',
            alignItems: 'center',
            border: '1px solid rgba(54, 162, 235, 0.2)',
          }}
        >
          <AccountBalanceWalletOutlinedIcon sx={{ 
            color: '#36A2EB',
            fontSize: { xs: '1.2rem', sm: '1.4rem' }
          }} />
        </Box>
        <Box>
          <Typography 
            variant="h6" 
            sx={{
              fontSize: { xs: '0.8rem', sm: '1.3rem' },
              color: '#fff',
              fontWeight: 600,
              letterSpacing: '0.5px',
              mb: 0.2
            }}
          >
            Liquidity Pools
          </Typography>
          <Typography 
            sx={{ 
              color: '#6B7280',
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box component="span" sx={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              backgroundColor: '#4CAF50',
              display: 'inline-block'
            }} />
            Active Pools Overview
          </Typography>
        </Box>
      </Box>
    </Grid>

    <Grid item>
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          background: 'rgba(54, 162, 235, 0.1)',
          borderRadius: '20px',
          padding: { xs: '6px 12px', sm: '6px 14px' },
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          ml: { xs: 1, sm: 2 },
          '&:hover': {
            background: 'rgba(54, 162, 235, 0.15)',
            transform: 'translateY(-1px)'
          }
        }}
      >
        <Typography 
          sx={{ 
            color: '#36A2EB',
            fontWeight: 500,
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            whiteSpace: 'nowrap'
          }}
        >
          Docs
        </Typography>
        <InfoOutlinedIcon sx={{ 
          fontSize: { xs: '0.9rem', sm: '1rem' },
          color: '#36A2EB'
        }} />
      </Box>
    </Grid>
  </Grid>



  

 {/* Pool Kartları */}
      <Grid container spacing={1} justifyContent="center">
        {/* 1 Günlük Havuz */}
        <Grid item xs={6} sm={3} >
          <PoolStats poolName="Pools" totalPools={totalPools} apy={25.21} fillPercentage={12} tvl='53.22M'  badgeText="Daily" leverage={125}/>
        </Grid>
        {/* 14 Günlük Havuz */}
        <Grid item xs={6} sm={3} >
          <PoolStats poolName="Pools" totalPools={totalPools} apy={30.44} fillPercentage={65} tvl='53.22M' badgeText="14D" leverage={125}/>
        </Grid>
        {/* 30 Günlük Havuz */}
      
        {/* 90 Günlük Havuz - Full olarak göster */}
        <Grid item xs={6} sm={3} sx={{mt:2}} >
          <PoolStats poolName="Pools" totalPools={totalPools} apy={40.68} fillPercentage={80} tvl='53.22M' badgeText="90D" leverage={125} />
        </Grid>
          <Grid item xs={6} sm={3} sx={{mt:2}} >
          <PoolStats poolName="Pools" totalPools={12} apy={35.99} fillPercentage={100} tvl='100.22M' badgeText="30D" leverage={125} />
        </Grid>
          <Grid item xs={6} sm={3} sx={{mt:2}} >
          <PoolStats poolName="Pools" totalPools={12} apy={35.99} fillPercentage={100} tvl='100.22M' badgeText="30D" leverage={125}/>
        </Grid>
          <Grid item xs={6} sm={3} sx={{mt:2}} >
          <PoolStats poolName="Pools" totalPools={12} apy={35.99} fillPercentage={100} tvl='100.22M' badgeText="30D" leverage={125} />
        </Grid>
          <Grid item xs={6} sm={3} sx={{mt:2}} >
          <PoolStats poolName="Pools" totalPools={12} apy={35.99} fillPercentage={100} tvl='100.22M' badgeText="30D" leverage={125}/>
        </Grid>
          <Grid item xs={6} sm={3} sx={{mt:2}} >
          <PoolStats poolName="Pools" totalPools={12} apy={35.99} fillPercentage={100} tvl='100.22M' badgeText="30D" leverage={125}/>
        </Grid>
          <Grid item xs={6} sm={3} sx={{mt:2}} >
          <PoolStats poolName="Pools" totalPools={12} apy={35.99} fillPercentage={100} tvl='100.22M' badgeText="30D" leverage={125}/>
        </Grid>
          <Grid item xs={6} sm={3} sx={{mt:2}} >
          <PoolStats poolName="Pools" totalPools={1.08} apy={35.99} fillPercentage={100} tvl='100.22M' badgeText="30D"   leverage={125}
/>
        </Grid>
      </Grid>

     



    
    </Box>
  );
};

export default Stats;
