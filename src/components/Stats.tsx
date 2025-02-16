import React, { useState, useMemo } from 'react';
import { Grid, Typography, Box, useTheme, useMediaQuery, ToggleButtonGroup, ToggleButton } from '@mui/material';
import PoolStats from './poolstats';
import AreaChartComponent from './charts/AreaChartComponent';
import BarChartComponent from './charts/BarChartComponent';
import "./text.css";
import Dashboard from './Dashboard';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AddIcon from '@mui/icons-material/Add';
import CreatePoolModal from './CreatePool/CreatePoolModal';
import { useNavigate } from 'react-router-dom';

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
  const [isCreatePoolModalOpen, setIsCreatePoolModalOpen] = useState(false);
  const navigate = useNavigate();

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

  // Get current values for dashboard
  const tvlData = continuousData.map(data => ({
    ...data,
    value: data.tvl
  }));
  const currentTVLValue = tvlData[tvlData.length - 1]?.tvl || 0;
  const previousTVLValue = tvlData[tvlData.length - 2]?.tvl || 0;
  const tvlChange = ((currentTVLValue - previousTVLValue) / previousTVLValue) * 100;

  // Get earnings values
  const currentEarningsValue = continuousData[continuousData.length - 1]?.earnings || 0;
  const previousEarningsValue = continuousData[continuousData.length - 2]?.earnings || 0;
  const earningsChange = ((currentEarningsValue - previousEarningsValue) / previousEarningsValue) * 100;

  // Format values for dashboard
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

  const dashboardData = {
    tvl: {
      value: formatValue(currentTVLValue),
      change: Number(tvlChange.toFixed(2)),
    },
    volume: {
      value: '51.16M',
      change: 11.90,
    },
    openInterest: {
      value: '129.3K',
      change: 0.1,
    },
    totalEarning: {
      value: formatValue(currentEarningsValue),
      change: Number(earningsChange.toFixed(2)),
    },
    users: {
      value: '162K',
      change: 0.00,
    },
  };

  const handlePoolClick = () => {
    navigate('/stake');
  };

  return (
      <Box 
       mx={-1}  >
        <Dashboard data={dashboardData} />

        {/* Chart Section */}
        <Box //@ts-ignore
        sx={{ mt: 8}}>
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
                    textTransform: 'none',
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
                  <ToggleButton value="earnings" sx={{
                    textTransform: 'none',
                  }} aria-label="24H Earnings">
                    24H Earnings
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
                  title="TVL"
                  valueLabel="TON"
                  timeRange={timeRange}
                />
              ) : (
                <BarChartComponent
                  data={getDisplayData()}
                  title="24H Earnings"
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
                onClick={() => setIsCreatePoolModalOpen(true)}
                sx={{ 
                  color: '#36A2EB',
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  whiteSpace: 'nowrap',
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer'
                }}
              >
                <AddIcon sx={{ fontSize: 16 }} />
                Create Pool
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Pool Kartları */}
        <Grid container spacing={1} justifyContent="center">
          {/* 1 Günlük Havuz */}
          <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={totalPools} apy={109.21} fillPercentage={49.72} tvl='53.84K' badgeText="Daily" leverage={220}/>
          </Grid>
          
          {/* 14 Günlük Havuz */}
          <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={totalPools} apy={129.44} fillPercentage={64.11} tvl='106.02K' badgeText="30D" leverage={220}/>
          </Grid>
          {/* 30 Günlük Havuz */}
        
          {/* 90 Günlük Havuz - Full olarak göster */}
          <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={totalPools} apy={220.68} fillPercentage={91.79} tvl='251.53K' badgeText="1D" leverage={75} />
          </Grid>
          <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={totalPools} apy={167.99} fillPercentage={79.53} tvl='183.22K' badgeText="1D" leverage={75} />
          </Grid>
          <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={totalPools} apy={108.52} fillPercentage={26.21} tvl='37.81K' badgeText="1D" leverage={75} />
          </Grid>
            <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={12} apy={178.99} fillPercentage={100} tvl='294.73K' badgeText="30D" leverage={200} />
          </Grid>
            <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={12} apy={152.87} fillPercentage={100} tvl='89.62K' badgeText="14D" leverage={75}/>
          </Grid>
            <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={12} apy={221.07} fillPercentage={100} tvl='231.62K' badgeText="1D" leverage={220} />
          </Grid>
            <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={12} apy={204.51} fillPercentage={100} tvl='189.52K' badgeText="1D" leverage={20}/>
          </Grid>
            <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={12} apy={163.80} fillPercentage={100} tvl='87.18K' badgeText="90D" leverage={220}/>
          </Grid>
            <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={12} apy={132.72} fillPercentage={100} tvl='132.22K' badgeText="14D" leverage={100}/>
          </Grid>
            <Grid item xs={6} sm={3} onClick={handlePoolClick} sx={{ cursor: 'pointer' }}>
            <PoolStats poolName="Pools" totalPools={1.08} apy={363.01} fillPercentage={100} tvl='2.83M' badgeText="1D" leverage={75}/>
          </Grid>
        </Grid>

        <CreatePoolModal 
          open={isCreatePoolModalOpen}
          onClose={() => setIsCreatePoolModalOpen(false)}
        />
      </Box>
  );
};

export default Stats;
