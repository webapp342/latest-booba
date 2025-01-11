import React, { useEffect, useState } from 'react';
import { Box, Typography, ThemeProvider, createTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",  // Daha uygun bir font
  },
});

const PlayMore: React.FC = () => {
  const [message, setMessage] = useState<{
    title: string;
    text: string;
    amount: string;
    option: 'TON' | 'BBLIP';
  }>({ title: '', text: '', amount: '', option: 'TON' });
  const [animKey, setAnimKey] = useState<number>(0);
  const [activeDot, setActiveDot] = useState<number>(0);

  const messages = [
     {
      text: "💥 We’ll giving away $10,000 every week !",
    },
   
    {
      text: "🎉 Are you ready to race to the top ?",
    },
 
  
   
  
    {
      text: "🌟 Keep playing, rewards are waiting for you !",
    },
    {
      text: "🎁 Get a 100% bonus on all deposits this week !",
    },
  ];

  const getRandomNumber = (option: 'TON' | 'BBLIP'): string => {
    if (option === 'TON') {
      return (Math.random() * (102.999 - 8.25) + 8.25).toFixed(2);
    } else {
      return (Math.random() * (999.999 - 8.25) + 8.25).toFixed(2);
    }
  };

  const getRandomOption = (): 'TON' | 'BBLIP' =>
    Math.random() < 0.46 ? 'TON' : 'BBLIP';

  useEffect(() => {
    const updateMessage = () => {
      const option = getRandomOption();
      setMessage({
        title: messages[Math.floor(Math.random() * messages.length)].text,
        text: messages[Math.floor(Math.random() * messages.length)].text,
        amount: getRandomNumber(option),
        option,
      });
      setAnimKey(prev => prev + 1);
      setActiveDot(prev => (prev + 1) % messages.length); // Update active dot
    };

    updateMessage();
    const interval = setInterval(updateMessage, 3000);
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
              py: 1,
              px: 1,
              textAlign: 'center',
              transform: 'scale(1)',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            
              animation: 'fade-in-up 0.5s ease-in-out',
            }}
          >
            {/* Title */}
          

            {/* Main Text */}
            <Typography variant="body1" sx={{ color: 'yellow', mt: 1,fontWeight: 'bold', fontSize: '0.8rem', lineHeight: 1.4 }}>
              {message.text}
            </Typography>

       

            {/* Dot navigation */}
            <Box sx={{ mt: 1 }}>
              <Box display="flex" justifyContent="center" gap={1}>
                {messages.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: index === activeDot ? 'yellow' : 'gray',
                      transition: 'background-color 0.3s ease',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    </ThemeProvider>
  );
};

export default PlayMore;
