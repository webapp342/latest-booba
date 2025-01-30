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
        flexDirection: 'column',
        alignItems: 'left',
        gap: 0.5,
       
        mb: 2
      }}>        <Tabs 
          value={currentPath.includes('statistics') ? '/latest-booba/stats/statistics' : '/latest-booba/stats'}
          sx={{ 
            '& .MuiTab-root': { 
              color: '#6B7280',
              '&.Mui-selected': { color: '#fff' }
            }
          }}
        >
          <Tab 
            label="Statistics" 
            value="/latest-booba/stats" 
            component={Link} 
            sx={{textTransform: 'none'}}        
            to="/latest-booba/stats" 
          />
          <Tab 
            label="Dashboard" 
            value="/latest-booba/stats/statistics" 
            component={Link} 
                        sx={{textTransform: 'none'}}        

            to="/latest-booba/stats/statistics" 
          />
        </Tabs>
      </Box>
      {children || <Outlet />}
    </Box>
  );
};

export default Layout; 