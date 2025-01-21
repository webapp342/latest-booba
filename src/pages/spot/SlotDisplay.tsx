import React, { useLayoutEffect } from 'react';
import SlotCounter from 'react-slot-counter';
import { Box, createTheme, ThemeProvider } from '@mui/material';

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
  useLayoutEffect(() => {
    // Sayfa yüklendiğinde animasyonu başlatabiliriz (sayfa ilk açıldığında düzgün gösterilmeli)
    setTimeout(() => {
      // Burada animasyon başlatıcı bir işlem olabilir
    }, 120); // Animasyonu başlatmadan önce küçük bir gecikme ekleyebilirsiniz
  }, []);

  const getColorClass = (index: number) => {
    switch (selectedSpinType) {
      case 'ticket':
        return 'green-slot'; 
      case 'total':
        return index === 0 ? 'red-slot' : 'green-slot';
      case 'bblip':
        return index < 2 ? 'red-slot' : 'green-slot';
      default:
        return 'red-slot';
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
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          border: '2px dotted #FFC107 ',
          alignItems: 'center',
          background: "#6f0101",
          borderRadius: 2,
          mb: 2,
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
                    zIndex: 1000, // Üst üste binen diğer elemanları engellemek için
                alignItems: 'center',
                 transform: 'translateZ(0)', // GPU hızlandırma için bu özellik eklendi
    willChange: 'transform',   // Animasyon performansı için optimize edilir
                borderRadius: 1,
                backgroundImage: getColorClass(index) === 'red-slot' 
                  ? 'radial-gradient( circle farthest-corner at 3.1% 6.8%,  rgba(199,0,59,1) 0%, rgba(255,88,53,1) 97.7% )' 
                  : 'linear-gradient( 110.3deg,  rgba(255,222,122,1) 5.2%, rgba(255,230,153,1) 51.5%, rgba(255,225,133,1) 95.9% )',
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
          </React.Fragment>
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default SlotDisplay;
