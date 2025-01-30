import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import Stats from './Stats';
import Statistics from './Statistics';

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'dashboard'>('stats');

  return (
    <Box sx={{ 
      padding: '16px', 
      marginTop: 6, 
      marginBottom: 14, 
      backgroundColor: '#1a2126', 
      borderRadius: 2
    }}>
      {/* TabBar */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 2
      }}>
        <Button
          variant={activeTab === 'stats' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('stats')}
          sx={{
            backgroundColor: activeTab === 'stats' ? '#36A2EB' : 'transparent',
            color: activeTab === 'stats' ? '#fff' : '#6B7280',
            '&:hover': {
              backgroundColor: activeTab === 'stats' ? '#36A2EB' : 'rgba(54, 162, 235, 0.1)',
            }
          }}
        >
          Statistics
        </Button>
        <Button
          variant={activeTab === 'dashboard' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('dashboard')}
          sx={{
            backgroundColor: activeTab === 'dashboard' ? '#36A2EB' : 'transparent',
            color: activeTab === 'dashboard' ? '#fff' : '#6B7280',
            '&:hover': {
              backgroundColor: activeTab === 'dashboard' ? '#36A2EB' : 'rgba(54, 162, 235, 0.1)',
            }
          }}
        >
          Dashboard
        </Button>
      </Box>

      {/* Content */}
      {activeTab === 'stats' ? (
        <Stats totalLockedTon={1000000} totalEarningsDistributed={500000} totalPools={10} performanceData={[]} />
      ) : (
        <Statistics />
      )}
    </Box>
  );
};

export default Layout; 