export const generateRandomNumber = (min: number, max: number): number => {
  try {
    console.log('generateRandomNumber çağrıldı:', { min, max });
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log('Üretilen random sayı:', result);
    return result;
  } catch (error) {
    console.error('Random sayı üretme hatası:', error);
    return 0;
  }
}; 