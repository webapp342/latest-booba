import { generateRandomNumber } from './random';

export const generateSpinNumbers = (selectedBalance: string, selectedSpinType: string, isFirstSpin: boolean = false): string[] => {
  console.log('generateSpinNumbers çağrıldı:', { selectedBalance, selectedSpinType, isFirstSpin });
  
  let result: string[] = ['0', '0', '0', '0', '0', '0'];

  try {
    if (isFirstSpin) {
      // İlk spin mantığı (normal spin yapısıyla aynı)
      if (selectedBalance === 'total') {
        if (selectedSpinType === 'total') {
          // TON için TON spin
          result = [
            '0',
            '0',
            generateRandomNumber(0, 1).toString(),
            generateRandomNumber(0, 4).toString(),
            generateRandomNumber(6, 9).toString(),
            generateRandomNumber(6, 9).toString(),
          ];
        } else if (selectedSpinType === 'bblip') {
          // TON için BBLIP spin
          result = [
            '0',
            '0',
            '0',
            generateRandomNumber(6, 9).toString(),
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
          ];
        } else if (selectedSpinType === 'ticket') {
          // TON için ticket spin
          result = [
            '0',
            '0',
            '0',
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
          ];
        }
      } else if (selectedBalance === 'bblip') {
        if (selectedSpinType === 'total') {
          // BBLIP için TON spin
          result = [
            '0',
            '0',
            generateRandomNumber(5, 9).toString(),
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
          ];
        } else if (selectedSpinType === 'bblip') {
          // BBLIP için BBLIP spin
          result = [
            '0',
            '0',
            generateRandomNumber(0, 9).toString(),
            generateRandomNumber(0, 9).toString(),
            generateRandomNumber(0, 9).toString(),
            generateRandomNumber(0, 9).toString(),
          ];
        } else if (selectedSpinType === 'ticket') {
          // BBLIP için ticket spin
          result = [
            '0',
            '0',
            '0',
            '0',
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
          ];
        }
      }
    } else {
      // Normal spin mantığı
      if (selectedBalance === 'total') {
        if (selectedSpinType === 'total') {
          // TON için TON spin: 0.1 - 99.999 TON arası
          result = [
            '0',
            '0',
            '0',
            generateRandomNumber(0, 2).toString(),
            generateRandomNumber(0, 5).toString(),
            generateRandomNumber(1, 9).toString(),
          ];
        } else if (selectedSpinType === 'bblip') {
          // TON için BBLIP spin: 1.000 - 9.999 BBLIP arası
          result = [
            '0',
            '0',
            '0',
            '0',
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
          ];
        } else if (selectedSpinType === 'ticket') {
          // TON için ticket spin: 0.001 - 0.999 TON arası
          result = [
            '0',
            '0',
            '0',
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
          ];
        }
      } else if (selectedBalance === 'bblip') {
        if (selectedSpinType === 'total') {
          // BBLIP için TON spin: 0.1 - 9.999 TON arası
          result = [
            '0',
            '0',
            '0',
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
          ];
        } else if (selectedSpinType === 'bblip') {
          // BBLIP için BBLIP spin: 5.000 - 99.999 BBLIP arası
          result = [
            '0',
            '0',
            '0',
            generateRandomNumber(0, 9).toString(),
            generateRandomNumber(0, 9).toString(),
            generateRandomNumber(0, 9).toString(),
          ];
        } else if (selectedSpinType === 'ticket') {
          // BBLIP için ticket spin: 0.001 - 0.099 TON arası
          result = [
            '0',
            '0',
            '0',
            generateRandomNumber(0, 9).toString(),
            generateRandomNumber(1, 9).toString(),
            generateRandomNumber(1, 9).toString(),
          ];
        }
      }
    }

    // Sonucu tek bir kez oluştur ve döndür
    const finalResult = [...result];
    console.log('Üretilen sayılar:', finalResult);
    return finalResult;
  } catch (error) {
    console.error('Sayı üretme hatası:', error);
    return ['0', '0', '0', '1', '2', '3']; // Hata durumunda bile kazansın
  }
}; 