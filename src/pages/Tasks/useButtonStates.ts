import { useState, useEffect } from 'react';
import { ButtonStates } from './Task';

export function useButtonStates() {
  const [buttonStates, setButtonStates] = useState<ButtonStates>({});

  useEffect(() => {
    const savedStates = localStorage.getItem('buttonStates');
    if (savedStates) {
      try {
        const parsedStates = JSON.parse(savedStates) as ButtonStates;
        const currentTime = Date.now();
        const validStates: ButtonStates = {};
        
        Object.entries(parsedStates).forEach(([key, state]) => {
          if (state.startTime && currentTime - state.startTime < 15000) {
            validStates[parseInt(key)] = state;
          }
        });
        
        setButtonStates(validStates);
      } catch (error) {
        console.error('Error parsing button states:', error);
        localStorage.removeItem('buttonStates');
      }
    }
  }, []);

  return { buttonStates, setButtonStates };
}