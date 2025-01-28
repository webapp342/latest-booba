import React from 'react';
import { Grid, Card, CardContent, Typography, IconButton, Box, Divider } from '@mui/material';
import { Lock, MonetizationOn } from '@mui/icons-material';  // İkonlar import edildi
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PoolStats from './poolstats'; // PoolStats bileşenini import et
import zoomPlugin from 'chartjs-plugin-zoom';
import Brand from './AiYield';
import "./text.css";



ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);
interface StatsProps {
  totalLockedTon: number;
  totalEarningsDistributed: number;
  totalPools: number;
  performanceData: number[];
}






const Stats: React.FC<StatsProps> = ({
  totalLockedTon,
  totalEarningsDistributed,
  totalPools,
  performanceData,
}) => {
  // Grafiğin verilerini oluşturuyoruz
  const data = {
    labels: ['28 Jan', '29 Jan', '30 Jan', '01 Feb', '02 Feb','03 Feb','04 Feb'],
    datasets: [
      {
        label: 'Protocol daily TON earnings ',
        data: performanceData,
        borderColor: '#00C853',
        
        
        backgroundColor: 'rgba(0, 200, 83, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

   const options = {
  responsive: true,
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 7,
        min: 0,
        max: 6,
        color: 'white', // Set the x-axis ticks color to white
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: 'white', // Set the y-axis ticks color to white
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        // Styling the label in the legend
        color: 'white', // Change label color to white
        font: {
          size: 14, // Adjust the font size
        },
      },
    },
    
    tooltip: {
      callbacks: {
        label: function (tooltipItem: { formattedValue: any; }) {
          // Ensure tooltip numbers are white as well
          return ` ${tooltipItem.formattedValue} TON`;
        },
      },
      bodyColor: 'white', // Set tooltip body text color to white
    },
  },
};


  return (
    <Box sx={{ padding: '16px', marginTop: 8, marginBottom: 14, backgroundColor: '#1a2126', borderRadius: 2 }}>
                                        <Brand /> {/* Add the ResponsiveAppBar here */}

                                         <Grid container mt={4} alignItems="center" justifyContent="space-between">
          {/* Total Pools İkonu */}
          <Grid item>
                        <Box display={'flex'} alignItems={'center'}>

          
      <Typography 
      className='text-gradient'  sx={{
        mt: "2vh",
      
        textAlign: "left",
     
        fontFamily: "'Press Start 2P', sans-serif",
        fontWeight: 700,
        fontSize: "1.2rem",
        letterSpacing: "1px",
      }}
   
              
             >
               Statistics
             </Typography>

           
            </Box>
         
          
          </Grid>

          <Grid item>
            <Typography variant="h6" color="gray" mt={2}>
              Learn more
            </Typography>
          </Grid>
          
        </Grid>


                          <Divider sx={{ bgcolor:'#6ed3ff',mb:2 }} />

                                        
                                            
      {/* Header */}
      
             

                                     

     

      {/* Performance Overview (Horizontal Cards) */}
      <Grid container spacing={2} justifyContent="center" alignItems="center" marginBottom={4}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: '#2f363a', borderRadius: 2 , }}>
        <CardContent sx={{my:-1}}>
  <Grid container  alignItems="center">
    {/* Lock ikonu başlığın sol tarafında */}
    <Grid item>
      <IconButton  color="primary">
        <Lock fontSize='small'  sx={{color:'#89d9ff'}} />
      </IconButton>
    </Grid>
    <Grid item>
      <Typography fontSize={'0.8rem'} fontWeight={'bold'} color="#909497">
                            Total Value Locked 
      </Typography>
    </Grid>
  </Grid>
              <Box display={"flex"} justifyContent={'space-between'}>
                 <Typography fontSize={'1.5rem'} color='white' ml={1}>
                  
        {new Intl.NumberFormat().format(totalLockedTon / 1000000)}M    <span className='text-gradient' style={{fontSize:'1.5rem'}}> TON</span>  </Typography>
  <Box display={'flex'} alignItems={'center'}>
      <Typography fontSize={'0.8rem'} sx={{color:'#98d974'}}  mt={1} >
    
          
               + 414.69K TON
  </Typography>
       <TrendingUpIcon sx={{mt:1, ml:1, color:'#98d974'}} fontSize='small' />

  </Box>
  
    
  </Box>
 
</CardContent>

          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: '#2f363a', borderRadius: 2 }}>
            <CardContent sx={{my:-1}}>
              <Grid container alignItems="center">
                {/* Monetization ikonu başlığın sol tarafında */}
                <Grid item>
                  <IconButton  >
                    <MonetizationOn fontSize='medium' sx={{color:'#89d9ff'}} />
                  </IconButton>
                </Grid>
                <Grid item >
                  <Typography fontSize={'0.8rem'} color="#909497" fontWeight={'bold'}>
                Total Distributed Earnings 
                  </Typography>
                </Grid>
              </Grid>
              <Box display={"flex"} justifyContent={'space-between'}>
                 <Typography fontSize={'1.5rem'} color='white' ml={1}>
             {new Intl.NumberFormat().format(totalEarningsDistributed / 1000000)}M <span className='text-gradient' style={{fontSize:'1.5rem'}}> TON</span>
              </Typography>


                <Box display={'flex'} alignItems={'center'}>
        <Typography fontSize={'0.8rem'} sx={{color:'#98d974'}} mt={0.5} >
               + 1.56M TON
              </Typography>
                   <TrendingUpIcon sx={{mt:1, ml:1, color:'#98d974'}} fontSize='small' />

  </Box>

              </Box>
 
            </CardContent>
          </Card>
        </Grid>
      </Grid>

   

  <Grid container alignItems="center" justifyContent="space-between">
          {/* Total Pools İkonu */}
          <Grid item>
                        <Box display={'flex'} alignItems={'center'}>

          
       <Typography variant="h6" color="white" fontSize={"1.3rem"}>
            Pools Stats
            </Typography>
           
            </Box>
         
          
          </Grid>

          <Grid item>
            <Typography variant="h6" color="gray">
              Learn more
            </Typography>
          </Grid>

        </Grid>


                          <Divider sx={{ bgcolor:'gray',mb:2 }} />

  

 {/* Pool Kartları */}
      <Grid container spacing={2} justifyContent="center">
        {/* 1 Günlük Havuz */}
        <Grid item xs={6} sm={3} >
          <PoolStats poolName="Pools" totalPools={totalPools} apy={25.21} fillPercentage={72} tvl='53.22M'  badgeText="Daily"/>
        </Grid>
        {/* 14 Günlük Havuz */}
        <Grid item xs={6} sm={3} >
          <PoolStats poolName="Pools" totalPools={totalPools} apy={30.44} fillPercentage={65} tvl='53.22M' badgeText="14D" />
        </Grid>
        {/* 30 Günlük Havuz */}
        <Grid item xs={6} sm={3} >
          <PoolStats poolName="Pools" totalPools={12} apy={35.99} fillPercentage={100} tvl='100.22M' badgeText="30D"/>
        </Grid>
        {/* 90 Günlük Havuz - Full olarak göster */}
        <Grid item xs={6} sm={3} >
          <PoolStats poolName="Pools" totalPools={totalPools} apy={40.68} fillPercentage={80} tvl='53.22M' badgeText="90D" />
        </Grid>
      </Grid>

       <Grid container mt={4} alignItems="center" justifyContent="space-between">
          {/* Total Pools İkonu */}
          <Grid item>
                        <Box display={'flex'} alignItems={'center'}>

          
       <Typography  variant="h6" color="white" fontSize={"1.3rem"}>
                           AiYield Performance

            </Typography>
           
            </Box>
         
          
          </Grid>

          <Grid item>
            <Typography variant="h6" color="gray">
              Learn more
            </Typography>
          </Grid>
          
        </Grid>


                          <Divider sx={{ bgcolor:'gray',mb:2 }} />
      <Card sx={{mt:2, marginBottom: '16px', backgroundColor: '#464c50', borderRadius: 2 }}>
        <CardContent>
         
          <Line color='white' data={data} options={options} />
     </CardContent>
      </Card>

           <Grid container mt={4} alignItems="center" justifyContent="space-between">
          {/* Total Pools İkonu */}
          <Grid item>
                        <Box display={'flex'} alignItems={'center'}>

          
       <Typography  variant="h6" color="white" fontSize={"1.3rem"}>
                                          Position Statistics


            </Typography>
           
            </Box>
         
          
          </Grid>

          <Grid item>
            <Typography variant="h6" color="gray">
              Learn more
            </Typography>
          </Grid>
          
        </Grid>


                          <Divider sx={{ bgcolor:'gray',mb:2 }} />
      {/* Quick Stats */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: '#2f363a', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                Yesterday's Earnings
              </Typography>
              <Typography variant="h5" color="error">
                You dont have any positions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: '#2f363a', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                Current Day's Earnings
              </Typography>
              <Typography variant="h5" color="error">
                You dont have any positions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Stats;
