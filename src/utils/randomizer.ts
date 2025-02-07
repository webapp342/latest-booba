import { boxesData } from '../data/boxesData';

export interface BoxReward {
  code: string;
  amount: number;
}

export const generateReward = (boxId: string): BoxReward => {
  const box = boxesData[boxId];
  if (!box) throw new Error('Box not found');

  // Mystery Gift Box için özel kontrol
  if (boxId === 'mystery-gift') {
    // Sadece 1key ve 5key kodlu ödülleri filtrele
    const allowedDrops = box.drops.filter(drop => drop.code && (drop.code === '1key' || drop.code === '5key'));
    
    if (allowedDrops.length === 0) {
      throw new Error('No valid drops found for mystery gift box');
    }

    // Toplam olasılık hesapla (sadece izin verilen ödüller için)
    const totalProbability = allowedDrops.reduce((sum, drop) => sum + drop.rarity, 0);
    
    // Rastgele sayı üret
    let random = Math.random() * totalProbability;
    
    // Ödülü seç
    for (const drop of allowedDrops) {
      random -= drop.rarity;
      if (random <= 0 && drop.code) {
        return {
          code: drop.code,
          amount: 1
        };
      }
    }
    
    // Eğer bir şekilde seçim yapılamazsa varsayılan olarak 1key ver
    return {
      code: '1key',
      amount: 1
    };
  }

  // Diğer kutular için normal mantık
  const validDrops = box.drops.filter(drop => drop.code);
  if (validDrops.length === 0) {
    throw new Error('No valid drops found for box');
  }

  const totalProbability = validDrops.reduce((sum, drop) => sum + drop.rarity, 0);
  let random = Math.random() * totalProbability;

  for (const drop of validDrops) {
    random -= drop.rarity;
    if (random <= 0 && drop.code) {
      return {
        code: drop.code,
        amount: 1
      };
    }
  }

  // Varsayılan dönüş - ilk geçerli ödülü kullan
  const firstValidDrop = validDrops[0];
  if (!firstValidDrop || !firstValidDrop.code) {
    throw new Error('No valid drops found');
  }

  return {
    code: firstValidDrop.code,
    amount: 1
  };
}; 