import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TONIcon from '../assets/kucukTON.png';
import AluminumIcon from '../assets/aluminum.png';
import HistoryIcon from '@mui/icons-material/History';
import AnimationIcon from '@mui/icons-material/Animation';import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';



const StatItem = ({ title, value, change, isRightAligned = false }: { 
  title: string; 
  value: string; 
  change?: number;
  isRightAligned?: boolean;
}) => (
  <Box sx={{ 
  
    textAlign: isRightAligned ? 'right' : 'left',

  }}>
    <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
      {title}
    </Typography>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      justifyContent: isRightAligned ? 'flex-end' : 'flex-start',
    }}>
      <Typography sx={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>
        {value}
      </Typography>
      {change !== undefined && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: change === 0 ? '#6B7280' : (change > 0 ? '#34D399' : '#F87171'),
          fontSize: '0.875rem'
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
  myEarnings, 
  dailyEarnings,
  dailyEarningsPercentage,
  mlpBalance 
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
}) => (
  <Box
    sx={{
      borderRadius: 2,
      p: 2,
      mb: 2,
      backgroundColor: '#2f363a',
      border: '1px solid #2D3135',
    }}
  >
    {/* Header */}
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 3
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', position: 'relative' }}>
          <img src={icon1} alt={symbol} style={{ width: 32, height: 32 }} />
          <img 
            src={icon2} 
            alt="USDC" 
            style={{ 
              width: 32, 
              height: 32,
              position: 'relative',
              left: -10,
              marginRight: -10 // To compensate for the overlap
            }} 
          />
        </Box>
        <Typography sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600 }}>
          {symbol}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ color: '#6B7280', fontSize: '1rem' }}>
          APY
        </Typography>
        <Typography sx={{ color: '#22C55E', fontSize: '1.2rem', fontWeight: 500 }}>
          {apy}%
        </Typography>
      </Box>
    </Box>

    {/* Main Stats */}
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      mb: 2
    }}>
      <Box>
        <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
          TVL
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img 
            src={TONIcon} 
            alt="TON" 
            style={{ 
              width: 16, 
              height: 16 
            }} 
          />
          <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>
            {tvl.replace('$', '')}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
          Duration
        </Typography>
        <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>
          {price}
        </Typography>
      </Box>
      <Box sx={{
        backgroundColor: '#6ed3ff',
        color: '#000',
        px: 2,
        
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}>
        <Typography sx={{ fontWeight: 600 }}>
          Earn
        </Typography>
      </Box>
    </Box>

    {/* Bottom Stats */}
    <Box sx={{ pt: 1, borderTop: '1px dashed gray' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
        Earnings: {myEarnings}
        </Typography>
        <Typography sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
          24h Earnings: {dailyEarnings}
          <span style={{ color: dailyEarningsPercentage === 0 ? '#6B7280' : '#22C55E' }}>
            ({dailyEarningsPercentage >= 0 ? '+' : ''}{dailyEarningsPercentage}%)
          </span>
        </Typography>
      </Box>
      <Typography sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
       lbTON Balance: {mlpBalance}
      </Typography>
    </Box>
  </Box>
);

const Statistics: React.FC = () => {
  return (
    <Box>
      {/* Dashboard Card */}
      <Box>
        {/* Header */}
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
              fontSize: '1.25rem',
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
            mb: 4
          }}
        >
          <Grid container spacing={3}>
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
              <AnimationIcon sx={{ 
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
      
            <InfoOutlinedIcon sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              color: '#36A2EB'
            }} />
          </Box>
        </Grid>
      </Grid>

      <CryptoCard
        symbol="TONUSDT"
        icon1={TONIcon}
        icon2={AluminumIcon}
        apy={1533.32}
        tvl="$1.73M"
        price="30 Day"
        myEarnings="$0.00"
        dailyEarnings="$0.00"
        dailyEarningsPercentage={0.00}
        mlpBalance="$0.00"
      />

      <CryptoCard
        symbol="ETHUSDC"
        icon1={TONIcon}
        icon2={AluminumIcon}
        apy={1324.91}
        tvl="$373.36k"
        price="14 Day"
        myEarnings="$0.00"
        dailyEarnings="$0.00"
        dailyEarningsPercentage={0.00}
        mlpBalance="$0.00"
      />

       <CryptoCard
        symbol="ETHUSDC"
        icon1={TONIcon}
        icon2={AluminumIcon}
        apy={1127.80}
        tvl="$296.21k"
        price="14 Day"
        myEarnings="$0.00"
        dailyEarnings="$0.00"
        dailyEarningsPercentage={0.00}
        mlpBalance="$0.00"
      />

       <CryptoCard
        symbol="ETHUSDC"
        icon1={TONIcon}
        icon2={AluminumIcon}
        apy={1068.40}
        tvl="$164.18k"
        price="14 Day"
        myEarnings="$0.00"
        dailyEarnings="$0.00"
        dailyEarningsPercentage={0.00}
        mlpBalance="$0.00"
      />

       <CryptoCard
        symbol="ETHUSDC"
        icon1={TONIcon}
        icon2={AluminumIcon}
        apy={789.12}
        tvl="$92.95k"
        price="1 Day"
        myEarnings="$0.00"
        dailyEarnings="$0.00"
        dailyEarningsPercentage={0.00}
        mlpBalance="$0.00"
      />

      <CryptoCard
        symbol="ETHUSDC"
        icon1={TONIcon}
        icon2={AluminumIcon}
        apy={789.12}
        tvl="$79.51k"
        price="1 Day"
        myEarnings="$0.00"
        dailyEarnings="$0.00"
        dailyEarningsPercentage={0.00}
        mlpBalance="$0.00"
      />
      <CryptoCard
        symbol="ETHUSDC"
        icon1={TONIcon}
        icon2={AluminumIcon}
        apy={789.12}
        tvl="$60.49k"
        price="1 Day"
        myEarnings="$0.00"
        dailyEarnings="$0.00"
        dailyEarningsPercentage={0.00}
        mlpBalance="$0.00"
      />
      <CryptoCard
        symbol="ETHUSDC"
        icon1={TONIcon}
        icon2={AluminumIcon}
        apy={789.12}
        tvl="$56.87k"
        price="1 Day"
        myEarnings="$0.00"
        dailyEarnings="$0.00"
        dailyEarningsPercentage={0.00}
        mlpBalance="$0.00"
      />
    </Box>
  );
};

export default Statistics; 