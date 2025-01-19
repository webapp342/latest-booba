import React, { useState } from 'react';

import { Box, Typography, Button, Avatar ,ThemeProvider, createTheme} from '@mui/material';

import { userData } from './UserData'; // Kullanıcı verileri

import { winnersData } from './WinnersData'; // Kazanan verileri

import Avatar1 from '../assets/bblip.png';

import Avatar2 from '../assets/photo_2022-08-17_14-02-04.jpg';
import Avatar3 from '../assets/photo_2021-09-17_13-13-13.jpg';
import avatar2 from '../assets/bblip.png';   
import Avatar4 from '../assets/photo_2023-05-11_07-26-40.jpg';
import Avatar5 from '../assets/photo_2025-01-11_19-40-01.jpg';
import Avatar6 from '../assets/photo_2025-01-11_19-40-34.jpg';     
import Avatar7 from '../assets/photo_2025-01-11_19-43-34.jpg';
import Avatar8 from '../assets/toncoin-ton-logo.png';

import UserRewards from './UserRewards';
import WelcomeBonus from './WelcomeBonus';






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

  // Yeni Avatar Verileri
  const avatarsData = {
    winners: [
      {
        rank: 1,
        username: 'Zambak21',
        balance: '206.8K',
        avatarImg: Avatar2,
        badgeColor: '#FFD700',
        badgeNumber: '1',
                reward: '50',
                                prizeImage: Avatar8,
                                                                prizeColor: '#00c6ff'



      },
      {
        rank: 2,
        username: 'arcticNova',
        balance: '198.1K',
        avatarImg: Avatar3,
        badgeColor: '#C0C0C0',
        badgeNumber: '2',
                reward: '20',
                                prizeImage: Avatar8,
                                prizeColor: '#00c6ff'


      },
      {
        rank: 3,
        username: 'Silent_Panther',
        balance: '194.3K',
        avatarImg: Avatar4,
        badgeColor: '#CD7F32',
        badgeNumber: '3',
                reward: '15',
                                prizeImage: Avatar8,
                                                                prizeColor: '#00c6ff'



      },
    ],
    holders: [
      {
        rank: 1,
        username: 'iteeCorn',
        balance: '300K',
        avatarImg: Avatar5, // Placeholder img
        badgeColor: '#4CAF50',
        badgeNumber: '1',
                reward: '5000',
                                prizeImage: Avatar1,
                                                                prizeColor: 'green'



      },
      {
        rank: 2,
        username: 'Icycometti1998',
        balance: '250K',
        avatarImg: Avatar6, // Placeholder img
        badgeColor: '#2196F3',
        badgeNumber: '2',
                reward: '2500',
                prizeImage: Avatar1,
                                                                                prizeColor: 'green'


      },
      {
        rank: 3,
        username: 'Mutedlllynx',
        balance: '200K',
        avatarImg: Avatar7, // Placeholder img
        badgeColor: '#FF5722',
        badgeNumber: '3',
        reward: '2500',
                        prizeImage: Avatar1,
                                                                                        prizeColor: 'green'


      },
    ],
  };



 

  return (
            <ThemeProvider theme={theme}>
<WelcomeBonus />
                    <UserRewards />  {/* Kullanıcı ödül kontrol bileşenini buraya ekleyin */}
                    


    <Box sx={{          backgroundColor:  'black',
 display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, mt:2, mb:5 }}>

      <Box>
 
              

        
      </Box>

      {/* Avatarlar */}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
        {/* Üst Satır - 1. Avatar */}
        <Box sx={{ marginBottom: -3 }}>
          <Box
            sx={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'visible',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              position: 'relative',
            }}
          >
            
        

            {/* Avatar Resmi */}
            <img
              src={avatarsData[activeTab][0].avatarImg}
              alt={`${avatarsData[activeTab][0].username} Avatar`}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                              borderRadius: '50%',

                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
              }}
            />

            {/* Yeni Eklenen Badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                  left: '50%',
                backgroundColor: avatarsData[activeTab][0].badgeColor,
                color: 'white',
                width: '25px',
                height: '25px',
                                  transform: 'translateX(-50%) translateY(50%)',

                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                border: `2px solid ${avatarsData[activeTab][0].badgeColor}`,
                zIndex: 3,
              }}
            >
              {avatarsData[activeTab][0].badgeNumber}
            </Box>
          </Box>
          <Typography sx={{ display: 'flex', fontSize: '0.8rem', mt: 1.5, color: '#FFFFFF', fontWeight: 'bold' , mx:1,}}>
            {avatarsData[activeTab][0].username}
          </Typography>
              <Typography sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold',  mx:1 }}>
            <img               src={avatarsData[activeTab][0].prizeImage}
 alt="Avatar" style={{ width: '20px', height: '20px', objectFit: 'cover', marginRight: '2px' , borderRadius:'50%'}} />
            {avatarsData[activeTab][0].balance}

          </Typography>
              <Typography color={avatarsData[activeTab][0].prizeColor} sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', fontSize: '0.8rem',  fontWeight: 'bold' }}>
             Prize:
                                     <img src={avatarsData[activeTab][0].prizeImage} alt="Avatar" style={{ width: '15px', height: '15px', objectFit: 'cover', marginLeft: '2px', marginRight:'2px' , borderRadius:'50%'}} />

            {avatarsData[activeTab][0].reward}


          </Typography>
        </Box>

        {/* Alt Satır - 2. ve 3. Avatarlar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: -10 }}>
          {avatarsData[activeTab].slice(1).map((avatar) => (
            <Box
              key={avatar.rank}
              sx={{
                display:'flex',
                justifyContent:'space-between',
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              {/* Rozet */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%) translateY(50%)',
                  backgroundColor: avatar.badgeColor,
                  color: 'white',
                  width: '25px',
                  height: '25px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: `2px solid ${avatar.badgeColor}`,
                  zIndex: 2,
                }}
              >
                {avatar.badgeNumber}
              </Box>
              <img
                src={avatar.avatarImg}
                alt={`${avatar.username} Avatar`}
                style={{
                  width: '100%',
                                    borderRadius: '50%',

                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1,
                  position: 'relative',
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Alt Avatar Bilgileri */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
          {avatarsData[activeTab].slice(1).map((avatar) => (
            <Box key={avatar.rank} sx={{ textAlign: 'center' }}>
              <Typography sx={{  fontSize: '0.6rem', mt: 1, color: '#FFFFFF', fontWeight: 'bold',  mx:1 }}>
                {avatar.username}
              </Typography>
              <Typography sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', ml:'22%',  mx:1 }}>
                                   <img src={avatarsData[activeTab][0].prizeImage} alt="Avatar" style={{ width: '17px', height: '17px', objectFit: 'cover', marginRight: '2px', borderRadius:'50%' }} />
 {avatar.balance}

              </Typography>
              
              <Typography color={avatarsData[activeTab][0].prizeColor} sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', fontSize: '0.8rem',  fontWeight: 'bold' }}>
  Prize:      <img src={avatarsData[activeTab][0].prizeImage} alt="Avatar" style={{ width: '15px', height: '15px', objectFit: 'cover', marginLeft: '2px',marginRight:'2px', borderRadius:'50%' }} />
{avatar.reward}

</Typography>
            </Box>
          ))}
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
      backgroundColor: activeTab === 'holders' ? '#00c6ff' : 'white',
      color: activeTab === 'holders' ? 'white' : '#1976d2',
      borderColor: '#00c6ff',
      borderRadius: 2,
       px:2,
       fontSize:'0.8rem',
      boxShadow: activeTab === 'holders' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
      transition: 'all 0.9s ease',
      '&:hover': {
        backgroundColor: activeTab === 'holders' ? '#1565c0' : '#e3f2fd',
        borderColor: '#1565c0',
      },
    }}
  >
    Top{' '}
    <Avatar
      src={avatar2}
      alt="Avatar"
      sx={{
        width: 20,
        height: 20,
        marginX: 1,
      }}
    />
    {activeTab === 'holders' ? 'Holders' : 'Winners'}
  </Button>


<Button
  onClick={() => handleTabChange('winners')}
  variant={activeTab === 'winners' ? 'contained' : 'outlined'}
  sx={{
    flexGrow: 1,
    marginLeft: 1,
    backgroundColor: activeTab === 'winners' ? '#00c6ff' : 'white',
    color: activeTab === 'winners' ? 'white' : '#1976d2',
    borderColor: '#00c6ff',
    textTransform: 'none',
    borderRadius: 2,
    px:2,
           fontSize:'0.8rem',

    boxShadow: activeTab === 'winners' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
    transition: 'all 0.9s ease',
    display: 'flex', // İç öğelerin yatay hizalanması için
    alignItems: 'center',
 
  }}
>
  Top{' '}
  <Avatar
        src="https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040"
    alt="Avatar"
    sx={{
      width: 15,
      height: 15,
    
      marginX: 1, // Yazı ile avatar arasında boşluk
    }}
  />
  Winners <span> (Jackpot)</span>
</Button>


</Box>


      {/* Aktif Sekme İçeriği */}

      {activeTab === 'winners' ? (
        <Box sx={{ width: '100%', backgroundColor: '#1E1E1E', padding: 2, marginTop: 2 }}>
          <Box sx={{ marginTop: 0 }}>
            {/* Add headings for Place ID and Prize */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', color: '#FFFFFF', }}>Place / USERNAME </Typography>

              <Typography sx={{ fontSize: '0.8rem', color: '#FFFFFF', }}>Weekly Prize</Typography>
            </Box>
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
                {/* Rank Value */}
                <Typography sx={{ fontSize: '1.5rem', color: '#FFFFFF', marginRight: 2 }}>
                  #{index + 4}
                </Typography>

                {/* Left Section: Username and Avatar+Balance */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontSize: '1rem', color: '#FFFFFF', }}>
                    {item.username}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                    <img
                      src={item.avatar2}
                      alt="Avatar2"
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius:'50%',
                        objectFit: 'cover',
                        marginRight: '5px',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.8rem', color: '#FFFFFF', }}>
                      {item.balance}
                    </Typography>
                  </Box>
                </Box>

                {/* Place ID */}
        

                {/* Prize Area */}
                <Typography sx={{ fontSize: '1rem', color: '#00c6ff', marginLeft: 2 }}> 
                  {item.prize ? item.prize : 'N/A'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%', backgroundColor: '#1E1E1E', padding: 2, marginTop: 2 }}>
          <Box sx={{ marginTop: 0 }}>
            {/* Add headings for Place ID and Prize */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 1 }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#FFFFFF', }}>Place / USERNAME </Typography>

              <Typography sx={{ fontSize: '0.8rem', color: '#FFFFFF', }}>Weekly Prize</Typography>
            </Box>
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
                {/* Rank Value */}
                <Typography sx={{ fontSize: '1.5rem', color: '#FFFFFF', marginRight: 2 }}>
                  #{index + 4}
                </Typography>

                {/* Left Section: Username and Avatar+Balance */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontSize: '1rem', color: '#FFFFFF', }}>
                    {item.username}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                    <img
                      src={item.avatar2}
                      alt="Avatar2"
                      style={{
                        width: '22px',
                        height: '22px',
                                                borderRadius:'50%',

                        objectFit: 'cover',
                        marginRight: '5px',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.8rem', color: '#FFFFFF', }}>
                      {item.balance}
                    </Typography>
                  </Box>
                </Box>

                {/* Place ID */}
               

                {/* Prize Area */}
                <Typography sx={{ fontSize: '1rem', color: 'green', marginLeft: 2 }}>
                  {item.prize ? item.prize : 'N/A'}
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