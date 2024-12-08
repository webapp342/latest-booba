import { FC, useRef, useState } from 'react';
import SlotCounter from 'react-slot-counter';
import { Button } from '../button/Button';
import { styles } from './styles';
import { generateRandomNumber } from './utils/random';

export const SlotMachine: FC = () => {
  const [numbers, setNumbers] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const counterRefs = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];

  const handleSpin = () => {
    const newNumbers = Array(5)
      .fill(0)
      .map(() => generateRandomNumber(0, 9));

    setNumbers(newNumbers); // Yeni sayıları state'e kaydet

    counterRefs.forEach((ref, index) => {
      setTimeout(() => {
        ref.current?.startAnimation({
          duration: 1,
          dummyCharacterCount: 50,
          direction: 'top-down',
          value: newNumbers[index].toString(),
        });
      }, index * 100); // Animasyonları sırayla başlat
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Slot Machine</h1>
      <div style={styles.slotsContainer}>
        {numbers.map((num, index) => (
          <div key={index} style={styles.slotRow}>
            <SlotCounter
              ref={counterRefs[index]}
              value={num.toString()} // Varsayılan değer yerine state'deki değer
              useMonospaceWidth
              charClassName="slot-char"
              containerClassName="slot-container"
            />
          </div>
        ))}
      </div>
      <Button onClick={handleSpin}>Spin!</Button>
    </div>
  );
};
