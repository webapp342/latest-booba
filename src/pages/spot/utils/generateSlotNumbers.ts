// src/utils/generateSlotNumbers.ts
export const generateSlotNumbers = (
    selectedBalance: string,
    selectedSpinType: string
  ): string[] => {
    return [...Array(6)].map((_, index) => {
      // Kombinasyona göre sayı aralıkları
      if (selectedBalance === 'total' && selectedSpinType === 'total') {
        switch (index) {
          case 0:
            return '0'; // Kırmızı kutu
          case 1:
            return generateRandomNumber(0, 5).toString();
          case 2:
            return generateRandomNumber(6, 8).toString();
          case 3:
            return generateRandomNumber(0, 2).toString();
          case 4:
            return generateRandomNumber(3, 6).toString();
          case 5:
            return generateRandomNumber(7, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      if (selectedBalance === 'total' && selectedSpinType === 'bblip') {
        switch (index) {
          case 0:
            return '0'; // Kırmızı kutu
          case 1:
            return generateRandomNumber(3, 7).toString();
          case 2:
            return generateRandomNumber(0, 4).toString();
          case 3:
            return generateRandomNumber(5, 8).toString();
          case 4:
            return generateRandomNumber(2, 6).toString();
          case 5:
            return generateRandomNumber(7, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      if (selectedBalance === 'total' && selectedSpinType === 'ticket') {
        switch (index) {
          case 0:
            return '0'; // Kırmızı kutu
          case 1:
            return generateRandomNumber(1, 4).toString();
          case 2:
            return generateRandomNumber(6, 8).toString();
          case 3:
            return generateRandomNumber(0, 5).toString();
          case 4:
            return generateRandomNumber(2, 7).toString();
          case 5:
            return generateRandomNumber(6, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      if (selectedBalance === 'bblip' && selectedSpinType === 'total') {
        switch (index) {
          case 0:
          case 1:
            return '0'; // Kırmızı kutular
          case 2:
            return generateRandomNumber(1, 5).toString();
          case 3:
            return generateRandomNumber(3, 7).toString();
          case 4:
            return generateRandomNumber(0, 4).toString();
          case 5:
            return generateRandomNumber(6, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      if (selectedBalance === 'bblip' && selectedSpinType === 'bblip') {
        switch (index) {
          case 0:
          case 1:
            return '0'; // Kırmızı kutular
          case 2:
            return generateRandomNumber(2, 6).toString();
          case 3:
            return generateRandomNumber(4, 8).toString();
          case 4:
            return generateRandomNumber(0, 3).toString();
          case 5:
            return generateRandomNumber(7, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      if (selectedBalance === 'bblip' && selectedSpinType === 'ticket') {
        switch (index) {
          case 0:
          case 1:
            return '0'; // Kırmızı kutular
          case 2:
            return generateRandomNumber(0, 4).toString();
          case 3:
            return generateRandomNumber(5, 9).toString();
          case 4:
            return generateRandomNumber(1, 3).toString();
          case 5:
            return generateRandomNumber(7, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      // Varsayılan durumda 0-9 aralığı
      return generateRandomNumber(0, 9).toString();
    });
  };
  
  // Yardımcı fonksiyon
  const generateRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  