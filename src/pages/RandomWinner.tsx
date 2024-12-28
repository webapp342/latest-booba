import Avatar3 from '../assets/toncoin-ton-logo.png';
import avatar2 from '../assets/logo5.jpg';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, ThemeProvider, createTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
});

const RandomWinner: React.FC = () => {
  const [message, setMessage] = useState<{
    username: string;
    amount: string;
    option: 'TON' | 'BBLIP';
  }>({ username: '', amount: '', option: 'TON' });
  const [animKey, setAnimKey] = useState<number>(0);

  const usernames = ['marrow1911', 'TᕼEGOᗪᖴᗩTᕼEᖇ', 'HayesAmiir', 'BREAKFAST98', 'kamikaze2Emre', 'Rojjan', 'Lumanporsu42',
     'abidiyeceksin', 'rrkrsnrz', 'opsiaman', 'rmuhammad1911', 'SwitzerH', '@Au613', 'ج.تابش', 'м!яя0sëməløn', 'Mitu Mituu', 'pleplee'
    , 'Justiene', 'playweb3gamee', 'mr_saxo', 'ChroGNer', 'TiONchin', 'lainDlEY', 'actotioN', 'JudisHog', 'mpLiSAtE', 'pstEdogR', 'ShadowByte'
  , 'omAISEme', 'MPROusTr', 'HElICiaT', 'poTeRAgO', 'goTHmeTA', 'tImesTop', 'rcHiMArO', 'TeNtayal', 'pUTIcTiv', 'ighTSYnI', 'MenTAMet'
, 'makasinToo', 'iazArashh', 'TemfestH', 'VKovalesvkis', 'TopSaveer', 'pomegranate', 'hatart91', 'ryerice', 'mpLiSAtE', 'foxokra', 'nixlyrics'];

  const getRandomNumber = (option: 'TON' | 'BBLIP'): string => {
    if (option === 'TON') {
      return (Math.random() * (102.999 - 8.25) + 8.25).toFixed(2);
    } else {
      return (Math.random() * (999.999 - 8.25) + 8.25).toFixed(2);
    }
  };

  const getRandomUsername = (): string =>
    usernames[Math.floor(Math.random() * usernames.length)];

  const getRandomOption = (): 'TON' | 'BBLIP' =>
    Math.random() < 0.46 ? 'TON' : 'BBLIP';

  useEffect(() => {
    const updateMessage = () => {
      const option = getRandomOption();
      setMessage({
        username: getRandomUsername(),
        amount: getRandomNumber(option),
        option,
      });
      setAnimKey(prev => prev + 1);
    };

    updateMessage();
    const interval = setInterval(updateMessage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Link to="/latest-booba/slot" style={{ textDecoration: 'none' }}>
        <Box display="flex" justifyContent="center" mt={0} mb={4}>
          <Box
            key={animKey}
            sx={{
              background: 'linear-gradient(to right,rgb(21, 109, 192),rgb(15, 13, 13))',
              borderRadius: 2,
              boxShadow: 3,
              width: '92vw',
              py: 0.5,
              textAlign: 'center',
              transform: 'scale(1)',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              animation: 'fade-in-up 0.5s ease-in-out',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bolder' }}>
                {message.username} 
              </Typography>
              <Typography variant="body1" sx={{ color: 'white' }}>
                earn
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    color: 'white',
                    marginRight: 1,
                  }}
                >
                  {message.amount}
                </Typography>
                <Avatar
                  alt={message.option}
                  src={message.option === 'TON' ? Avatar3 : avatar2}
                  sx={{ width: 20, height: 20 }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'monospace',
                    color: 'white',
                    marginRight: 1,
                    marginLeft: 1,
                  }}
                >
                  in
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    color: 'yellow',
                    marginRight: 1,
                    marginLeft: 1,
                  }}
                >
                  Jackpot
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    </ThemeProvider>
  );
};

export default RandomWinner;
