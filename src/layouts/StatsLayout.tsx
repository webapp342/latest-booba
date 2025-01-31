import { Outlet, Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const Layout = ({ children }: { children?: ReactNode }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Box sx={{ 
      padding: '16px', 
      marginTop: 2, 
      backgroundColor: '#1a2126', 
      borderRadius: 2
    }}>
      <Box sx={{ 
        borderRadius: 2, 
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2
      }}>
        <Tabs 
          value={currentPath.includes('statistics') ? '/latest-booba/stats/statistics' : '/latest-booba/stats'}
          variant="fullWidth"
          sx={{ 
            width: '100%',
            minHeight: { xs: '48px', sm: '48px' },
            position: 'relative',
            zIndex: 2,
            '& .MuiTab-root': { 
              color: '#6B7280',
              minHeight: { xs: '48px', sm: '48px' },
              padding: { xs: '12px 16px', sm: '12px 24px' },
              minWidth: { xs: '120px', sm: '160px' },
              fontSize: { xs: '0.875rem', sm: '0.9rem' },
              '&.Mui-selected': { 
                color: '#fff',
                fontWeight: 600
              },
              
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6ed3ff'
            }
          }}
        >
          <Tab 
            label="Statistics" 
            value="/latest-booba/stats" 
            component={Link} 
            sx={{
              textTransform: 'none',
              flex: 1
            }}        
            to="/latest-booba/stats" 
          />
          <Tab 
            label="Dashboard" 
            value="/latest-booba/stats/statistics" 
            component={Link} 
            sx={{
              textTransform: 'none',
              flex: 1,
                position: 'relative',
            zIndex: 2,
              width: '100%',
              maxWidth: 'none',
              '&.MuiButtonBase-root': {
                padding: { xs: '12px 8px', sm: '12px 16px' },
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none'
              }
            }}        
            to="/latest-booba/stats/statistics" 
          />
        </Tabs>
      </Box>
      {children || <Outlet />}
    </Box>
  );
};

export default Layout; 