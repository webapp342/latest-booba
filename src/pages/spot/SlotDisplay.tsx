import React from 'react';
import SlotCounter from 'react-slot-counter';
import { Box } from '@mui/material';

interface SlotDisplayProps {
  numbers: string;
  counterRefs: React.Ref<any>[];
  selectedSpinType: string;
}

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        color: 'white',
        padding: '1rem',
        width: '100%',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Hafif gölge
        border: '1px solid #e0e0e0',

        alignItems: 'center',
        backgroundColor: 'whitesmoke',
        borderRadius: '12px',
        margin: '1rem 0 2rem 0',
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
        borderRadius: '10px',
        backgroundColor: getColorClass(index) === 'red-slot' ? 'red' : 'green',
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
          color: '#333',
        }}
      >
        •
      </Box>
    )}
  </React.Fragment>
))}


 
    </Box>

  );
};

export default SlotDisplay;
