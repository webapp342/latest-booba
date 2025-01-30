import React, { useState } from 'react';
import { Box, Grid, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import TimelineIcon from '@mui/icons-material/Timeline';
import UpdateIcon from '@mui/icons-material/Update';

interface DashboardProps {
  data: {
    tvl: { value: string; change: number; };
    volume: { value: string; change: number; };
    openInterest: { value: string; change: number; };
    totalEarning: { value: string; change: number; };
    users: { value: string; change: number; };
  };
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'dashboard'>('stats');

  const handleTabChange = (_: React.MouseEvent<HTMLElement>, newTab: 'stats' | 'dashboard') => {
    if (newTab !== null) {
      setActiveTab(newTab);
    }
  };

  const StatCard = ({ title, value, change, icon }: { title: string; value: string; change: number; icon: React.ReactNode }) => (
    <Box
      sx={{
        borderRadius: 1.5,
        p: 1,
        backgroundColor: '#2f363a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        sx={{
          p: 0.7,
          borderRadius: 1,
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon as React.ReactElement, { 
          sx: { color: '#36A2EB', fontSize: '1.2rem' }
        })}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            color: '#6B7280',
            fontSize: '0.75rem',
            fontWeight: 500,
      
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'baseline',
          gap: 1
        }}>
          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            {value}
          </Typography>
          
          <Typography
            sx={{
              color: change >= 0 ? '#34D399' : '#F87171',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <ToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={handleTabChange}
            size="small"
            sx={{
              backgroundColor: 'transparent',
              '& .MuiToggleButton-root': {
                color: '#6B7280',
                border: 'none',
                fontSize: '0.9rem',
                textTransform: 'none',
                px: 2,
                '&.Mui-selected': {
                  color: '#36A2EB',
                  backgroundColor: 'transparent',
                  fontWeight: 600,
                },
                '&:hover': {
                  backgroundColor: 'rgba(54, 162, 235, 0.1)',
                },
              },
            }}
          >
            <ToggleButton value="stats">Statistics</ToggleButton>
            <ToggleButton value="dashboard">Dashboard</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ 
          bgcolor: '#2f363a', 
          borderRadius: 2, 
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5
        }}>
          <Typography
            sx={{
              color: '#ffffff',
              fontSize: '1.2rem',
              fontWeight: 600,
            }}
          >
            Market Overview
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: '#6B7280',
            fontSize: '0.75rem'
          }}>
            <UpdateIcon sx={{ fontSize: '0.9rem' }} />
            <Typography sx={{ fontSize: '0.75rem' }}>
              Updated every 24 hours
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <StatCard
            title="TVL"
            value={data.tvl.value}
            change={data.tvl.change}
            icon={<AccountBalanceWalletOutlinedIcon />}
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard
            title="Volume"
            value={data.volume.value}
            change={data.volume.change}
            icon={<ShowChartIcon />}
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard
            title="Interest"
            value={data.openInterest.value}
            change={data.openInterest.change}
            icon={<MonetizationOnOutlinedIcon />}
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard
            title="24H Earnings"
            value={data.totalEarning.value}
            change={data.totalEarning.change}
            icon={<TimelineIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;