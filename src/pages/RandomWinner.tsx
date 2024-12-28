import Avatar3 from '../assets/toncoin-ton-logo.png';
import avatar2 from '../assets/logo5.jpg';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar,ThemeProvider, createTheme  } from '@mui/material';
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

  const usernames = ['janesmith', 'johnDoe', 'aliceWonder', 'bobBuilder'];

  const getRandomNumber = (): string =>
    (Math.random() * (999.99 - 8.25) + 8.25).toFixed(2);

  const getRandomUsername = (): string =>
    usernames[Math.floor(Math.random() * usernames.length)];

  const getRandomOption = (): 'TON' | 'BBLIP' =>
    Math.random() > 0.5 ? 'TON' : 'BBLIP';

  useEffect(() => {
    const updateMessage = () => {
      setMessage({
        username: getRandomUsername(),
        amount: getRandomNumber(),
        option: getRandomOption(),
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
            width: '92vw', // Ekran genişliğinin %5'i
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {message.username}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                color: 'white',
                mt: 1,
              }}
            >
              WIN
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
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
                sx={{ width: 28, height: 28 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Link>
        </ThemeProvider>
    
  );
};

export default RandomWinner;
