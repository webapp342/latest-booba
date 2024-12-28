import React from 'react';
import SlotCounter from 'react-slot-counter';
import { Box,createTheme, ThemeProvider } from '@mui/material';

interface SlotDisplayProps {
  numbers: string;
  counterRefs: React.Ref<any>[];
  selectedSpinType: string;
}

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },

});

const SlotDisplay: React.FC<SlotDisplayProps> = ({ numbers, counterRefs, selectedSpinType }) => {
  const getColorClass = (index: number) => {
    switch (selectedSpinType) {
      case 'ticket':
        return 'green-slot'; // Tüm kutular yeşil
      case 'total':
        return index === 0 ? 'red-slot' : 'green-slot'; // İlk kutu kırmızı, diğerleri yeşil
      case 'bblip':
        return index < 2 ? 'red-slot' : 'green-slot'; // İlk 2 kutu kırmızı, diğerleri yeşil
      default:
        return 'red-slot'; // Varsayılan kırmızı
    }
  };

  return (
        <ThemeProvider theme={theme}>
    
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        color: 'black',
        padding: '1rem',
  
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Hafif gölge
        border: '2px dotted #FFC107 ',

        alignItems: 'center',
        background: "#6f0101",

        borderRadius: 2,
        mb:2,
        textAlign: 'center',
      }}
    >
   
   
    {[...numbers].map((char, index) => (
  <React.Fragment key={index}>
    <Box
      className={`slot-row ${getColorClass(index)}`}
      sx={{
        width: { xs: '55px', sm: '65px', md: '65px', lg: '95px' },
        height: { xs: '35px', sm: '45px', md: '60px', lg: '70px' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 1,
        backgroundImage: getColorClass(index) === 'red-slot' ? 'radial-gradient( circle farthest-corner at 3.1% 6.8%,  rgba(199,0,59,1) 0%, rgba(255,88,53,1) 97.7% )' : 'linear-gradient( 110.3deg,  rgba(255,222,122,1) 5.2%, rgba(255,230,153,1) 51.5%, rgba(255,225,133,1) 95.9% )',
      }}
    >
      {getColorClass(index) === 'red-slot' ? (
        <Box className="static-number" sx={{ fontWeight: 'bold' }}>
          0
        </Box>
      ) : (
        <SlotCounter
          ref={counterRefs[index]}
          value={char}
          useMonospaceWidth
          charClassName="slot-char"
          containerClassName="slot-container"
        />
      )}
    </Box>
    {index === 2 && (
      <Box
        component="span"
        sx={{
          alignSelf: 'center',
          marginLeft: '5px',
          marginRight: '5px',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          color: '#FFC107',
          mt: 1,
        }}
      >
        •
      </Box>
    )}
  </React.Fragment>
))}


 
    </Box>
            </ThemeProvider>
    

  );
};

export default SlotDisplay;
