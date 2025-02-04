import { boxesData } from '../data/boxesData';

export interface BoxReward {
  code: string;
  amount: number;
}

export const generateReward = (boxId: string): BoxReward => {
  const box = boxesData[boxId];
  if (!box) throw new Error('Box not found');

  const drops = box.drops;
  const totalWeight = drops.reduce((sum, drop) => sum + drop.rarity, 0);
  let random = Math.random() * totalWeight;
  
  for (const drop of drops) {
    random -= drop.rarity;
    if (random <= 0 && drop.code) {
      return {
        code: drop.code,
        amount: 1
      };
    }
  }
  
  // Fallback to first item if something goes wrong
  const firstDrop = drops[0];
  if (!firstDrop || !firstDrop.code) {
    throw new Error('Invalid drop data');
  }
  
  return {
    code: firstDrop.code,
    amount: 1
  };
}; 