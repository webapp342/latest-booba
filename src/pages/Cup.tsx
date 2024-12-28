import React, { useState,  } from 'react';

import { Box, Typography, Button, Avatar ,ThemeProvider, createTheme} from '@mui/material';

import { userData } from './UserData'; // Kullanıcı verileri

import { winnersData } from './WinnersData'; // Kazanan verileri

import Avatar1 from '../assets/logo5.png';

import Avatar2 from '../assets/photo_2022-08-17_14-02-04.jpg';
import RandomWinner from './RandomWinner'; // RandomWinner bileşenini içeri aktarıyoruz
import Avatar3 from '../assets/photo_2021-09-17_13-13-13.jpg';
import avatar2 from '../assets/logo5.jpg';
import Avatar4 from '../assets/photo_2023-05-11_07-26-40.jpg';






const TopComponent: React.FC = () => {

  const [activeTab, setActiveTab] = useState<'winners' | 'holders'>('holders');



  const handleTabChange = (tab: 'winners' | 'holders') => {

    setActiveTab(tab);

  };

  // Tema oluşturma
  const theme = createTheme({
    typography: {
      fontFamily: "monospace",
    },
  });



 

  return (
            <ThemeProvider theme={theme}>
    

    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>

      <Box>
 
              
        <RandomWinner />
        
      </Box>

      {/* Avatarlar */}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '95%' }}>

        {/* Avatar 2 */}

        <Box sx={{position: 'relative',   width: '22%', height: 'auto', overflow: 'hidden', mt: 5, mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
{/* Rozeti avatarın ortasında ve altında konumlandır */}
  <Box
  sx={{
    position: 'absolute',
    top: '41%',
    left: '50%',
    transform: 'translate(-50%, 50%)',
    backgroundColor: '#C0C0C0',
    color: 'white',
    width: '5vw', // Ekran genişliğinin %5'i
    height: '5vw', // Yükseklik de aynı oranda
    maxWidth: '50px',
    maxHeight: '50px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    border: '2px solid #C0C0C0',
    zIndex: 2,
  }}
>
  2
</Box>

          <img src={Avatar3} alt="Avatar 2" style={{   position: 'relative',borderRadius:"50%", width: '100%', height: '100%', objectFit: 'cover' }} />

          <Typography sx={{ textAlign: 'center', fontSize: '0.8rem', mt: 1, color: 'black' }}>arcticNova</Typography>

          <Typography sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', fontSize: '0.8rem', color: 'black' }}>

            <img src={Avatar1} alt="Avatar 1" style={{ width: '20px', height: '20px', objectFit: 'cover', marginRight: '2px' }} />

            198.1K

          </Typography>

        </Box>


        {/* Avatar 1 */}

        <Box sx={{    position: 'relative', // Rozet için gerekli
 width: '35%', height: 'auto', overflow: 'hidden', mb: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          
 {/* Rozeti avatarın ortasında ve altında konumlandır */}
  <Box
    sx={{
      position: 'absolute',
      top: '46%', // Yatay ortalama
      left: '50%', // Dikey ortalama
      transform: 'translate(-50%, 50%)', // Ortayı merkez al ve biraz alta kaydır
    backgroundColor: '#FFD700', // Bronz rengi      
    color: 'black',
    width: '7vw', // Ekran genişliğinin %5'i
    height: '7vw', // Yükseklik de aynı oranda
    maxWidth: '50px',
    maxHeight: '50px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '1rem',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
      border: '2px solid #FFD700',
      zIndex: 2, // Rozeti öne çıkar
    }}
  >
    1
  </Box>
          <img src={Avatar2} alt="Avatar 1" style={{ borderRadius:"50%",     position: 'relative', // Z-index uyumu için
 width: '100%', height: '100%', objectFit: 'cover' }} />

          <Typography sx={{ textAlign: 'center', fontSize: '1rem', mt: 1, color: 'black' }}>Zambak21</Typography>

          <Typography sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', fontSize: '1rem', color: 'black' }}>

            <img src={Avatar1} alt="Avatar 1" style={{ width: '20px', height: '20px', objectFit: 'cover', marginRight: '2px' }} />

            206.8K

          </Typography>

        </Box>


        {/* Avatar 3 */}

     <Box
  sx={{
    width: '22%',
    height: 'auto',
    overflow: 'hidden',
    mt: 5,
    mb: 2,
    display: 'flex',
    color: 'black',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Rozet için gerekli
  }}
>
  {/* Rozeti avatarın ortasında ve altında konumlandır */}
  <Box
    sx={{
      position: 'absolute',
      top: '41%', // Yatay ortalama
      left: '50%', // Dikey ortalama
      transform: 'translate(-50%, 50%)', // Ortayı merkez al ve biraz alta kaydır
    backgroundColor: '#CD7F32', // Bronz rengi      
    color: 'white',
     width: '5vw', // Ekran genişliğinin %5'i
    height: '5vw', // Yükseklik de aynı oranda
    maxWidth: '50px',
    maxHeight: '50px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '1rem',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
      border: '2px solid #CD7F32',
      zIndex: 2, // Rozeti öne çıkar
    }}
  >
    3
  </Box>

  <img
    src={Avatar4}
    alt="Avatar 3"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius:"50%",
      position: 'relative', // Z-index uyumu için
    }}
  />

  <Typography
    sx={{ textAlign: 'center', fontSize: '0.8rem', mt: 1, color: 'black' }}
  >
    Silent_Panther
  </Typography>

  <Typography
    sx={{
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      fontSize: '0.8rem',
      color: 'black',
    }}
  >
    <img
      src={Avatar1}
      alt="Avatar 1"
      style={{
        width: '20px',
        height: '20px',
        objectFit: 'cover',
        marginRight: '2px',
      }}
    />
    194.3K
  </Typography>
</Box>



      </Box>


      {/* Sekme Butonları */}

     <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between', // Butonların tam genişliğe yayılmasını sağlar
    marginTop: 2,
    width: '100%', // Box tam genişliği kapsar
  }}
>
  <Button
    onClick={() => handleTabChange('holders')}
    variant={activeTab === 'holders' ? 'contained' : 'outlined'}
    sx={{
      flexGrow: 1, // Buton genişler
      textTransform: 'none',
      marginRight: 1, // Butonlar arasına boşluk
      backgroundColor: activeTab === 'holders' ? '#1976d2' : 'white',
      color: activeTab === 'holders' ? 'white' : '#1976d2',
      borderColor: '#1976d2',
      borderRadius: 2,
    
      boxShadow: activeTab === 'holders' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: activeTab === 'holders' ? '#1565c0' : '#e3f2fd',
        borderColor: '#1565c0',
      },
    }}
  >
    Top  <Avatar
    src={avatar2}
    alt="Avatar"
    sx={{
      width: 20,
      height: 20,
      marginX: 1, // Yazı ile avatar arasında boşluk
    }}
  /> Holders
  </Button>


<Button
  onClick={() => handleTabChange('winners')}
  variant={activeTab === 'winners' ? 'contained' : 'outlined'}
  sx={{
    flexGrow: 1,
    marginLeft: 1,
    backgroundColor: activeTab === 'winners' ? '#1976d2' : 'white',
    color: activeTab === 'winners' ? 'white' : '#1976d2',
    borderColor: '#1976d2',
    textTransform: 'none',
    borderRadius: 2,
    px:3,
    boxShadow: activeTab === 'winners' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
    transition: 'all 0.3s ease',
    display: 'flex', // İç öğelerin yatay hizalanması için
    alignItems: 'center',
    '&:hover': {
      backgroundColor: activeTab === 'winners' ? '#1565c0' : '#e3f2fd',
      borderColor: '#1565c0',
    },
  }}
>
  Top 
  <Avatar
        src="https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040"
    alt="Avatar"
    sx={{
      width: 20,
      height: 20,
    
      marginX: 1, // Yazı ile avatar arasında boşluk
    }}
  />
  Winners  <span> (Jackpot)</span>
</Button>


</Box>


      {/* Aktif Sekme İçeriği */}

      {activeTab === 'winners' ? (

        <Box sx={{ width: '100%', backgroundColor: 'white', padding: 2, marginTop: 2 }}>

       

         <Box sx={{ marginTop: 0 }}>
  {winnersData.map((item, index) => (
    <Box
      key={item.id}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #ddd',
      }}
    >
      {/* Left Section: Username and Avatar+Balance */}
      <Box>
        <Typography sx={{ fontSize: '1rem', color: 'black' }}>
          {item.username}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
          <img
            src={item.avatar2}
            alt="Avatar2"
            style={{
              width: '22px',
              height: '22px',
              objectFit: 'cover',
              marginRight: '5px',
            }}
          />
          <Typography sx={{ fontSize: '0.8rem', color: 'black' }}>
            {item.balance}
          </Typography>
        </Box>
      </Box>

      {/* Rank Value */}
      <Typography sx={{ fontSize: '1.5rem', color: 'black' }}>
        #{index + 1}
      </Typography>
    </Box>
  ))}
</Box>


        </Box>

      ) : (

        <Box sx={{ width: '100%', backgroundColor: 'white', padding: 2, marginTop: 2 }}>

       

          <Box sx={{ marginTop: 0 }}>

            {userData.map((item, index) => (

                <Box
      key={item.id}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #ddd',
      }}
    >
      {/* Left Section: Username and Avatar+Balance */}
      <Box>
        <Typography sx={{ fontSize: '1rem', color: 'black' }}>
          {item.username}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
          <img
            src={item.avatar2}
            alt="Avatar2"
            style={{
              width: '22px',
              height: '22px',
              objectFit: 'cover',
              marginRight: '5px',
            }}
          />
          <Typography sx={{ fontSize: '0.8rem', color: 'black' }}>
            {item.balance}
          </Typography>
        </Box>
      </Box>

      {/* Rank Value */}
      <Typography sx={{ fontSize: '1.5rem', color: 'black' }}>
        {index + 4}
      </Typography>
    </Box>
            ))}

          </Box>

        </Box>

      )}

    </Box>
        </ThemeProvider>
    

  );

};


export default TopComponent;