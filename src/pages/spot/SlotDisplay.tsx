import React from 'react';
import { styles } from './styles';
import SlotCounter from 'react-slot-counter';
import './SlotDisplay.css'; // CSS dosyasını import ediyoruz
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
      flexDirection: 'row', // Kutuları yatay hizalamak için 'row' kullanıyoruz
      gap: '10px',
      color: '#000', // Metin rengi siyah
      padding: '1rem',
      backgroundColor: '#f8f8f8',
      borderRadius: '12px',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)', // İçeriğe gölge ekleniyor
      margin: '1rem 0 2rem 0', // Dış kenarlara margin ekleniyor
      border: '1px solid #e0e0e0', // Border ekleniyor
      textAlign: 'center', // Yazıları ortalamak için
    }}
  >   {[...numbers].map((char, index) => (
        <div key={index} className="slot-item">
          <div className={`slot-row ${getColorClass(index)}`}>
            {getColorClass(index) === 'red-slot' ? (
              // Kırmızı kutular için sadece "0" gösteriyoruz
              <div className="static-number">0</div>
            ) : (
              // Yeşil kutularda SlotCounter animasyonu devam ediyor
              <SlotCounter
                ref={counterRefs[index]}
                value={char}
                useMonospaceWidth
                charClassName="slot-char"
                containerClassName="slot-container"
              />
            )}
          </div>
          {/* Nokta ekleme: 3. kutudan sonra sağ tarafına */}
          {index === 2 && <span className="dot">•</span>}
        </div>
      ))}
    </Box>
  );
};

export default SlotDisplay;
