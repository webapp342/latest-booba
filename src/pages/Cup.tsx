import React, { useState } from 'react';

import { Box, Typography, Button } from '@mui/material';

import { userData } from './UserData'; // Kullanıcı verileri

import { winnersData } from './WinnersData'; // Kazanan verileri

import Avatar1 from '../assets/logo5.png';

import Avatar2 from '../assets/silver.png';

import Avatar3 from '../assets/silver.png';


const TopComponent: React.FC = () => {

  const [activeTab, setActiveTab] = useState<'winners' | 'holders'>('winners');


  const handleTabChange = (tab: 'winners' | 'holders') => {

    setActiveTab(tab);

  };


  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>

      {/* Avatarlar */}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '95%' }}>

        {/* Avatar 2 */}

        <Box sx={{ width: '22%', height: 'auto', overflow: 'hidden', mt: 5, mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

          <img src={Avatar2} alt="Avatar 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

          <Typography sx={{ textAlign: 'center', fontSize: '0.8rem', mt: 1, color: 'black' }}>username1</Typography>

          <Typography sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', fontSize: '0.8rem', color: 'black' }}>

            <img src={Avatar1} alt="Avatar 1" style={{ width: '20px', height: '20px', objectFit: 'cover', marginRight: '2px' }} />

            206.1K

          </Typography>

        </Box>


        {/* Avatar 1 */}

        <Box sx={{ width: '35%', height: 'auto', overflow: 'hidden', mb: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

          <img src={Avatar1} alt="Avatar 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

          <Typography sx={{ textAlign: 'center', fontSize: '1rem', mt: 1, color: 'black' }}>username1</Typography>

          <Typography sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', fontSize: '1rem', color: 'black' }}>

            <img src={Avatar1} alt="Avatar 1" style={{ width: '20px', height: '20px', objectFit: 'cover', marginRight: '2px' }} />

            206.1K

          </Typography>

        </Box>


        {/* Avatar 3 */}

        <Box sx={{ width: '22%', height: 'auto', overflow: 'hidden', mt: 5, mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

          <img src={Avatar3} alt="Avatar 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

          <Typography sx={{ textAlign: 'center', fontSize: '0.8rem', mt: 1, color: 'black' }}>username1</Typography>

          <Typography sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', fontSize: '0.8rem', color: 'black' }}>

            <img src={Avatar1} alt="Avatar 1" style={{ width: '20px', height: '20px', objectFit: 'cover', marginRight: '2px' }} />

            206.1K

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
    padding: '0 16px', // Kenar boşlukları
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
      padding: '12px',
      boxShadow: activeTab === 'holders' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: activeTab === 'holders' ? '#1565c0' : '#e3f2fd',
        borderColor: '#1565c0',
      },
    }}
  >
    Top Holders
  </Button>

  <Button
    onClick={() => handleTabChange('winners')}
    variant={activeTab === 'winners' ? 'contained' : 'outlined'}
    sx={{
      flexGrow: 1, // Buton genişler
      marginLeft: 1, // Butonlar arasına boşluk
      backgroundColor: activeTab === 'winners' ? '#1976d2' : 'white',
      color: activeTab === 'winners' ? 'white' : '#1976d2',
      borderColor: '#1976d2',
      textTransform: 'none',
      borderRadius: 2,
      padding: '12px',
      boxShadow: activeTab === 'winners' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: activeTab === 'winners' ? '#1565c0' : '#e3f2fd',
        borderColor: '#1565c0',
      },
    }}
  >
    Top Winners
  </Button>
</Box>


      {/* Aktif Sekme İçeriği */}

      {activeTab === 'winners' ? (

        <Box sx={{ width: '100%', backgroundColor: 'white', padding: 2, marginTop: 2 }}>

       

          <Box sx={{ marginTop: 0 }}>

            {winnersData.map((item, index) => (

              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ddd' }}>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                  <img src={item.avatar1} alt="Avatar1" style={{ width: '30px', height: '30px', objectFit: 'cover', marginRight: '10px' }} />

                  <Typography sx={{ fontSize: '1rem', color: 'black' }}>{item.username}</Typography>

                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                  <img src={item.avatar2} alt="Avatar2" style={{ width: '15px', height: '15px', objectFit: 'cover', marginRight: '5px' }} />

                  <Typography sx={{ fontSize: '0.8rem', color: 'black' }}>{item.balance}</Typography>

                </Box>

<Typography sx={{ fontSize: '1rem', color: 'black' }}>#{index + 1}</Typography> {/* Rank value */}

              </Box>

            ))}

          </Box>

        </Box>

      ) : (

        <Box sx={{ width: '100%', backgroundColor: 'white', padding: 2, marginTop: 2 }}>

       

          <Box sx={{ marginTop: 0 }}>

            {userData.map((item, index) => (

              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ddd' }}>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                  <img src={item.avatar1} alt="Avatar1" style={{ width: '30px', height: '30px', objectFit: 'cover', marginRight: '10px' }} />

                  <Typography sx={{ fontSize: '1rem', color: 'black' }}>{item.username}</Typography>

                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                  <img src={item.avatar2} alt="Avatar2" style={{ width: '15px', height: '15px', objectFit: 'cover', marginRight: '5px' }} />

                  <Typography sx={{ fontSize: '0.8rem', color: 'black' }}>{item.balance}</Typography>

                </Box>

<Typography sx={{ fontSize: '1rem', color: 'black' }}>#{index + 4}</Typography> {/* Rank value */}

              </Box>

            ))}

          </Box>

        </Box>

      )}

    </Box>

  );

};


export default TopComponent;