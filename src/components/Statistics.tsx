import React, { useState } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TONIcon from '../assets/kucukTON.png';
import HistoryIcon from '@mui/icons-material/History';
import AnimationIcon from '@mui/icons-material/Animation';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LinearProgress from '@mui/material/LinearProgress';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreatePoolModal from './CreatePool/CreatePoolModal';
import { useNavigate } from 'react-router-dom';

const StatItem = ({ title, value, change, isRightAligned = false }: { 
  title: string; 
  value: string; 
  change?: number;
  isRightAligned?: boolean;
}) => (
  <Box //@ts-ignore
  sx={{ 
    textAlign: isRightAligned ? 'right' : 'left',
  }}>
    <Typography sx={{ 
      color: 'rgba(255, 255, 255, 0.7)', 
      fontSize: '0.8rem',
      mb: 0.5,
      fontWeight: 500
    }}>
      {title}
    </Typography>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      justifyContent: isRightAligned ? 'flex-end' : 'flex-start',
    }}>
      <Typography sx={{ 
        color: '#fff', 
        fontSize: '1.1rem', 
        fontWeight: 600,
        letterSpacing: '0.5px'
      }}>
        {value}
      </Typography>
      {change !== undefined && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: change === 0 ? 'rgba(255, 255, 255, 0.5)' : (change > 0 ? '#22C55E' : '#EF4444'),
          fontSize: '0.75rem',
          fontWeight: 500
        }}>
          {change === 0 ? '-' : change > 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
          {Math.abs(change).toFixed(2)}%
        </Box>
      )}
    </Box>
  </Box>
);

const CryptoCard = ({ 
  symbol, 
  icon1,
  icon2,
  apy, 
  tvl, 
  price,
  poolStats = {
    volume24h: '$1.2M',
    fees24h: '$3.2K',
    change24h: 2.5,
    totalUsers: '1.2K',
    currentCapacity: 750000,
    maxCapacity: 1000000
  }
}: {
  symbol: string;
  icon1: string;
  icon2: string;
  apy: number;
  tvl: string;
  price: string;
  myEarnings: string;
  dailyEarnings: string;
  dailyEarningsPercentage: number;
  mlpBalance: string;
  poolStats?: {
    volume24h: string;
    fees24h: string;
    change24h: number;
    totalUsers: string;
    currentCapacity: number;
    maxCapacity: number;
  };
}) => {
  const navigate = useNavigate();
  const capacityPercentage = (poolStats.currentCapacity / poolStats.maxCapacity) * 100;
  const remainingCapacity = poolStats.maxCapacity - poolStats.currentCapacity;
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
  <Box
    sx={{
        borderRadius: '16px',
        p: { xs: 2, sm: 3 },
      mb: 2,
        background: 'linear-gradient(180deg, rgba(47, 54, 58, 0.95) 0%, rgba(47, 54, 58, 0.85) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(110, 211, 255, 0.3)',
        }
      }}
    >
      {/* Header with APY Focus */}
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 3
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'flex', position: 'relative' }}>
            <img src={icon1} alt={symbol} style={{ 
              width: 36, 
              height: 36,
              borderRadius: '50%',
              padding: '2px'
            }} />
            <img 
              src={icon2} 
              alt="USDC" 
              style={{ 
                width: 36, 
                height: 36,
                position: 'relative',
                left: -12,
                marginRight: -12,
                borderRadius: '50%',
                padding: '2px'
              }} 
            />
        </Box>
          <Box>
            <Typography sx={{ 
              color: '#fff', 
              fontSize: { xs: '1rem', sm: '1.15rem' }, 
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>
          {symbol}
        </Typography>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.75rem'
            }}>
              Popular Pool
            </Typography>
          </Box>
      </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 1,
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            padding: '6px 12px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}>
            <Typography sx={{ 
              color: '#22C55E', 
              fontSize: '1.1rem', 
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}>
              {apy}% APY
        </Typography>
          </Box>
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.75rem',
            mt: 0.5
          }}>
            Last 24h avg.
        </Typography>
      </Box>
    </Box>

      {/* Performance Metrics */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2,
        mb: 3,
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        p: 2
      }}>
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.75rem',
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              24h Trading Volume
            </Typography>
            <Typography sx={{ 
              color: '#fff', 
              fontSize: '1rem', 
              fontWeight: 600
            }}>
              {poolStats.volume24h}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.75rem',
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              Total Value Locked
            </Typography>
            <Typography sx={{ 
              color: '#fff', 
              fontSize: '1rem', 
              fontWeight: 600
            }}>
              {tvl}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.75rem',
              mb: 0.5
            }}>
              24h Performance
            </Typography>
    <Box sx={{ 
      display: 'flex', 
              alignItems: 'center', 
              gap: 0.5 
            }}>
              <Typography sx={{ 
                color: poolStats.change24h >= 0 ? '#22C55E' : '#EF4444',
                fontSize: '1rem', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center'
              }}>
                {poolStats.change24h >= 0 ? <TrendingUpIcon sx={{ fontSize: '1.2rem' }} /> : <TrendingDownIcon sx={{ fontSize: '1.2rem' }} />}
                {Math.abs(poolStats.change24h)}%
              </Typography>
            </Box>
          </Box>
      <Box>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.75rem',
              mb: 0.5
            }}>
              24h Fees Generated
        </Typography>
            <Typography sx={{ 
              color: '#fff', 
              fontSize: '1rem', 
              fontWeight: 600
            }}>
              {poolStats.fees24h}
          </Typography>
          </Box>
        </Box>
      </Box>

      {/* Action Section */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(110, 211, 255, 0.1)',
        borderRadius: '12px',
        p: 2
      }}>
      <Box>
          <Typography sx={{ 
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 600,
            mb: 0.5
          }}>
            Start Earning Now
        </Typography>
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.75rem'
          }}>
            Lock Period: {price}
        </Typography>
      </Box>
        <Button
          sx={{
            backgroundColor: '#6ed3ff',
            color: '#000',
            px: 3,
            py: 1,
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#5bc0ff',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(110, 211, 255, 0.2)'
            }
          }}
          onClick={() => navigate('/stake')}
        >
          Subscribe
        </Button>
      </Box>

      {/* Pool Stats */}
      <Box //@ts-ignore
       sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 2,
        pt: 2,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Typography sx={{ 
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}>
          Active Users: {poolStats.totalUsers}
        </Typography>
        <Typography sx={{ 
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.75rem'
        }}>
          Pool Share Available
        </Typography>
      </Box>

      {/* Pool Capacity Section */}
      <Box //@ts-ignore
       sx={{ 
        mt: 2,
        pt: 2,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1
        }}>
          <Box>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.75rem',
              mb: 0.5
            }}>
              Pool Capacity
            </Typography>
            <Typography sx={{ 
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              {formatNumber(poolStats.currentCapacity)} TON Locked
            </Typography>
    </Box>
          <Box //@ts-ignore
          sx={{ textAlign: 'right' }}>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.75rem',
              mb: 0.5
            }}>
              Until Full
        </Typography>
            <Typography sx={{ 
              color: capacityPercentage > 90 ? '#EF4444' : 
                     capacityPercentage > 75 ? '#F59E0B' : '#22C55E',
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              {formatNumber(remainingCapacity)} TON
        </Typography>
      </Box>
        </Box>
        <Box //@ts-ignore
         sx={{ position: 'relative', mt:2, }}>
          <LinearProgress
            variant="determinate"
            value={capacityPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: capacityPercentage > 90 ? '#EF4444' : 
                                capacityPercentage > 75 ? '#F59E0B' : '#22C55E',
                borderRadius: 4,
              }
            }}
          />
          <Typography sx={{ 
          
            right: 0,
            top: '100%',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.7rem',
            mt: 0.5,
         
          }}>
            {capacityPercentage.toFixed(1)}% Pool Filled
      </Typography>
        </Box>
    </Box>
  </Box>
);
};

const Statistics: React.FC = () => {
  const hasUserPools = false;
  const [showAllPools, setShowAllPools] = useState(false);
  const [isCreatePoolModalOpen, setIsCreatePoolModalOpen] = useState(false);

  // Pool data array to make it easier to manage
  const poolData = [
    {
      symbol: "TON/USDT",
      apy: 1247.89,
      tvl: "$3.12M",
      price: "7 Day",
      poolStats: {
        volume24h: '$2.8M',
        fees24h: '$8.4K',
        change24h: 12.8,
        totalUsers: '38.2K',
        currentCapacity: 934827,
        maxCapacity: 1100000
      }
    },
    {
      symbol: "TON/USDT",
      apy: 968.45,
      tvl: "$1.85M",
      price: "14 Day",
      poolStats: {
        volume24h: '$1.9M',
        fees24h: '$5.7K',
        change24h: -3.2,
        totalUsers: '2.13K',
        currentCapacity: 756392,
        maxCapacity: 1000000
      }
    },
    {
      symbol: "TON/USDT",
      apy: 886.32,
      tvl: "$942.5K",
      price: "30 Day",
      poolStats: {
        volume24h: '$1.2M',
        fees24h: '$3.6K',
        change24h: 5.7,
        totalUsers: '1.8K',
        currentCapacity: 478563,
        maxCapacity: 1000000
      }
    },
    {
      symbol: "TON/USDT",
      apy: 754.18,
      tvl: "$685.2K",
      price: "90 Day",
      poolStats: {
        volume24h: '$980.5K',
        fees24h: '$2.9K',
        change24h: -1.8,
        totalUsers: '1.4K',
        currentCapacity: 623847,
        maxCapacity: 1000000
      }
    },
    {
      symbol: "TON/USDT",
      apy: 692.75,
      tvl: "$524.8K",
      price: "3 Day",
      poolStats: {
        volume24h: '$845.2K',
        fees24h: '$2.5K',
        change24h: 7.2,
        totalUsers: '1.1K',
        currentCapacity: 892436,
        maxCapacity: 1000000
      }
    },
    {
      symbol: "TON/USDT",
      apy: 578.90,
      tvl: "$398.4K",
      price: "1 Day",
      poolStats: {
        volume24h: '$632.8K',
        fees24h: '$1.9K',
        change24h: -2.4,
        totalUsers: '928',
        currentCapacity: 267893,
        maxCapacity: 1000000
      }
    },
    {
      symbol: "TON/USDT",
      apy: 486.45,
      tvl: "$286.6K",
      price: "1 Day",
      poolStats: {
        volume24h: '$485.3K',
        fees24h: '$1.4K',
        change24h: 4.3,
        totalUsers: '880',
        currentCapacity: 745218,
        maxCapacity: 1000000
      }
    },
    {
      symbol: "TON/USDT",
      apy: 423.30,
      tvl: "$195.2K",
      price: "1 Day",
      poolStats: {
        volume24h: '$324.5K',
        fees24h: '$972',
        change24h: -0.8,
        totalUsers: '647',
        currentCapacity: 534692,
        maxCapacity: 1000000
      }
    }
  ];

  const displayedPools = showAllPools ? poolData : poolData.slice(0, 2);

  return (
    <Box //@ts-ignore
    mx={-1} mb={10}>
      {/* Dashboard Card */}
      <Box //@ts-ignore
      sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 1
        }}>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Dashboard
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: '#36A2EB',
              cursor: 'pointer',
            }}
          >
            <HistoryIcon fontSize="small" />
            <Typography sx={{ fontSize: '0.875rem' }}>History</Typography>
          </Box>
        </Box>

        {/* Stats Card */}
        <Box
          sx={{
            borderRadius: '16px',
            p: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <StatItem
                title="Total Value"
                value="$0.00"
              />
            </Grid>
            <Grid item xs={6}>
              <StatItem
                title="Total Earnings"
                value="$0.00"
                isRightAligned
              />
            </Grid>
            <Grid item xs={6}>
              <StatItem
                title="30D Earnings"
                value="$0.00"
              />
            </Grid>
            <Grid alignItems={'right'} item xs={6}>
              <StatItem
                title="24h Earnings"
                value="$0.00"
                change={0.00}
                isRightAligned
              />
            </Grid>
          </Grid>
        </Box>
      </Box>


                    <Box display="flex" alignItems="center" gap={1.5}>

     <Box
                  sx={{
                    background: 'linear-gradient(135deg, rgba(110, 211, 255, 0.1), rgba(140, 230, 255, 0.1))',
                    borderRadius: '8px',
                    p: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgba(110, 211, 255, 0.2)',
                  }}
                >
                  <AccountBalanceIcon sx={{ 
                    color: '#6ed3ff',
                    fontSize: { xs: '1.2rem', sm: '1.4rem' }
                  }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '1.2rem' },
                      color: '#fff',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      mb: 0.2
                    }}
                  >
                    Your Pools
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#6B7280',
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    }}
                  >
                    Manage your created pools
                  </Typography>
                </Box>
       </Box>
      {/* Create Your Own Pool Section - Moved to top */}
      <Box sx={{ mb: 4 }}>
        
        <Box
          sx={{
            background: 'linear-gradient(180deg, rgba(47, 54, 58, 0.95) 0%, rgba(47, 54, 58, 0.85) 100%)',
            border: '1px solid rgba(110, 211, 255, 0.1)',
            borderRadius: '16px',
            p: 1,
            mt:1,
          }}
        >
       

          {/* Title in middle */}
    

          {/* Description below title */}
        

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: 1.5,
            mb: 3,
     
          }}>
            <Box sx={{ 
              flex: 1,
              background: 'rgba(34, 197, 94, 0.05)',
              borderRadius: '10px',
              p: 1,
              border: '1px solid rgba(34, 197, 94, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.2s ease-in-out',
           
            }}>
              <Box sx={{
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '6px',
                p: 0.5,
                mb: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                < RocketLaunchIcon  sx={{ fontSize: '1rem', color: '#22C55E' }} />
              </Box>
              <Typography sx={{ 
               fontSize: '0.8rem',
                fontWeight: 600,
       
                color: '#22C55E',
          
              }}>
                2x APY
              </Typography>
       
            </Box>

            <Box sx={{ 
              flex: 1,
              background: 'rgba(110, 211, 255, 0.05)',
              borderRadius: '10px',
              p: 1,
              border: '1px solid rgba(110, 211, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.2s ease-in-out',
             
            }}>
              <Box sx={{
                background: 'rgba(110, 211, 255, 0.1)',
                borderRadius: '6px',
                p: 0.5,
                mb: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <CheckCircleOutline sx={{ fontSize: '1rem', color: '#6ed3ff' }} />
              </Box>
              <Typography sx={{ 
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#6ed3ff',
           
              }}>
                Full Control
              </Typography>
           
            </Box>

            <Box sx={{ 
              flex: 1,
              background: 'rgba(168, 85, 247, 0.05)',
              borderRadius: '10px',
                  p: 1,
              border: '1px solid rgba(168, 85, 247, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.2s ease-in-out',
              
            }}>
              <Box sx={{
                background: 'rgba(168, 85, 247, 0.1)',
                borderRadius: '6px',
                p: 0.5,
                mb: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <ControlPointDuplicateIcon
 sx={{ fontSize: '1rem', color: '#A855F7' }} />
              </Box>
              <Typography sx={{ 
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#A855F7',
        
     
              }}>
                Extra Income
              </Typography>
           
            </Box>
          </Box>
  <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.85rem',
              mb: 1,
              mt:-2,
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Create your own pool and earn additional rewards from other users' deposits
          </Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Button
            fullWidth
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setIsCreatePoolModalOpen(true)}
              sx={{
                backgroundColor: '#6ed3ff',
                color: '#000',
                py: 1.2,
                px: 4,
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#89d9ff',
                }
              }}
            >
              Create Pool
            </Button>
          </Box>
        </Box>
      </Box>

     

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Popular Pools */}
        <Grid item xs={12} md={8}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2
          }}>
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
              <AnimationIcon sx={{ 
                color: '#36A2EB',
                fontSize: { xs: '1.2rem', sm: '1.4rem' }
              }} />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                sx={{
                    fontSize: { xs: '0.8rem', sm: '1.2rem' },
                  color: '#fff',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  mb: 0.2
                }}
              >
                Popular Pools
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
               Popular Pools Overview
              </Typography>
            </Box>
          </Box>
          <Box //@ts-ignore
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              background: 'rgba(54, 162, 235, 0.1)',
              borderRadius: '20px',
              padding: { xs: '6px 12px', sm: '6px 14px' },
              cursor: 'pointer',
              transition: 'all 0.2s ease',
             
            }}
          >
            <InfoOutlinedIcon sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              color: '#36A2EB'
            }} />
          </Box>
          </Box>

          {/* Popular Pool Cards */}
          <Box 
           sx={{ 
            maxHeight: showAllPools ? 'calc(100vh - 300px)' : 'auto',
            overflowY: showAllPools ? 'auto' : 'visible',
            pr: 2,
            mr: -2,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(110, 211, 255, 0.05)',
              borderRadius: '4px',
              margin: '4px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(110, 211, 255, 0.1)',
              borderRadius: '4px',
              border: '2px solid rgba(110, 211, 255, 0.05)',
             
            }
          }}>
            {displayedPools.map((pool, index) => (
              <CryptoCard
                key={index}
                symbol={pool.symbol}
                icon1={TONIcon}
                icon2="https://s3-symbol-logo.tradingview.com/crypto/XTVCUSDT--big.svg"
                apy={pool.apy}
                tvl={pool.tvl}
                price={pool.price}
                myEarnings="$0.00"
                dailyEarnings="$0.00"
                dailyEarningsPercentage={0.00}
                mlpBalance="$0.00"
                poolStats={pool.poolStats}
              />
            ))}

            {!showAllPools && (
              <Box //@ts-ignore
                onClick={() => setShowAllPools(true)}
                sx={{
                  borderRadius: '16px',
                  p: 3,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
               
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: '#6ed3ff'
                }}>
                  <Typography sx={{ 
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    See all
                  </Typography>
                  <Box 
                    component="span" 
                    sx={{ 
                      fontSize: '0.8rem',
                      backgroundColor: 'rgba(110, 211, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '4px 8px',
                      border: '1px solid rgba(110, 211, 255, 0.2)',
                    }}
                  >
                    {poolData.length - 2}+
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Right Column - Your Pools */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 2
            }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box //@ts-ignore
                  sx={{
                    background: 'linear-gradient(135deg, rgba(110, 211, 255, 0.1), rgba(140, 230, 255, 0.1))',
                    borderRadius: '8px',
                    p: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgba(110, 211, 255, 0.2)',
                  }}
                >
                  <ManageHistoryIcon sx={{  
                    color: '#6ed3ff',
                    fontSize: { xs: '1.2rem', sm: '1.4rem' }
                  }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '1.2rem' },
                      color: '#fff',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      mb: 0.2
                    }}
                  >
                    Your Pools
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#6B7280',
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    }}
                  >
                    Manage your created pools
                  </Typography>
                </Box>
              </Box>
            </Box>

            {!hasUserPools ? (
              <Box
                sx={{
                  background: 'linear-gradient(180deg, rgba(47, 54, 58, 0.95) 0%, rgba(47, 54, 58, 0.85) 100%)',
                  border: '1px solid rgba(110, 211, 255, 0.1)',
                  borderRadius: '16px',
                  p: 2,
                  textAlign: 'center'
                }}
              >
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.85rem',
              
                  }}
                >
                  You haven't created any pools yet.
                </Typography>
           
              </Box>
            ) : (
              <Box>
                {/* User pools will be listed here */}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <CreatePoolModal 
        open={isCreatePoolModalOpen}
        onClose={() => setIsCreatePoolModalOpen(false)}
      />
      
      {/* Add button to open modal */}
    
    </Box>
  );
};

export default Statistics; 