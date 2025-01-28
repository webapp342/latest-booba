import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import tonLogo from '../assets/kucukTON.png';

interface PoolStatsProps {
  poolName: string;
  totalPools: number;
  apy: number;
  tvl: string;
  fillPercentage: number; // Doluluk oranı
  badgeText: string; // Corner badge için dinamik metin
}

const PoolStats: React.FC<PoolStatsProps> = ({
  poolName,
  totalPools,
  apy,
  tvl,

  fillPercentage,
  badgeText, // Yeni props
}) => {
  // Renk ve doluluk durumu belirleme
  const isFull = fillPercentage === 100;
  const progressColor = isFull ? 'error' : 'primary'; // Eğer doluluk 100% ise kırmızı (error) olsun
    const textColor = isFull ? 'error' : 'white'; // Eğer doluluk 100% ise kırmızı (error) olsun

  const fillText = isFull ? '100% Full' : `Pool Filled ${fillPercentage}% `; // Eğer doluluk 100% ise "100% Full" yazsın, diğer durumda yüzdelik yazsın

  return (
    <Card sx={{ backgroundColor: '#2f363a', borderRadius: 2, boxShadow: 6, position: 'relative' }}>
      
      {/* Corner Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 8,
          background: '#6ed3ff', // Renk geçişi
          color: 'black',
          padding: '3px 7px',
          borderRadius: '6px', // Yuvarlak köşe
          boxShadow: 2, // Hafif gölge
          fontSize: '0.9rem',
          fontWeight: 'bold',
          zIndex: 10, // Diğer içeriklerin üstünde olmasını sağlar
        }}
      >
        {badgeText} {/* Dinamik Badge Metni */}
      </Box>
      
       <CardContent>
         <Typography variant="h6" color="#8b8b8b" align="left">
       Duration :
        </Typography>
<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>   

        <Typography  fontWeight={'bold'} display={'flex'} justifyContent={'space-between'} variant="h6" color="#8b8b8b" align="left">
          {poolName} : 
        </Typography>
     <span style={{color:'white', display:'flex', fontSize:'0.8rem'}}>
            {totalPools} </span> 
            </Box>


<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>   
   
        <Typography  fontWeight={'bold'} display={'flex'} justifyContent={'space-between'} variant="h6" color="#8b8b8b" align="left">
          APY:    
            </Typography>
            <span style={{color:'#98d974',fontSize:'0.8rem'}}>{apy}%                     
        
          </span>
    </Box>
        

         
        
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>   

     
        <Typography  fontWeight={'bold'} display={'flex'} justifyContent={'space-between'} variant="h6" color="#8b8b8b" align="left">
          TVL: 
        </Typography>
     <span style={{color:'white', display:'flex', fontSize:'0.8rem'}}>
 {tvl}         <img src={tonLogo} alt=""  width={20}  style={{marginLeft:2}}/>

        </span>

            </Box>

        
        {/* Doluluk oranını gösteren grafik */}
        <Box sx={{ width: '100%', marginTop: 1 }}>
          <LinearProgress
            variant="determinate"
            value={fillPercentage}
            color={progressColor} // Burada renk belirliyoruz
            sx={{ height: 10, borderRadius: 2 }}
          />
        </Box>
        
        <Typography variant="body2" color={textColor} align="center" sx={{ marginTop: 1 }}>
          {fillText} {/* Burada doluluk oranını yazıyoruz */}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PoolStats;