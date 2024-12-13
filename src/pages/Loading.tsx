import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import WebApp from '@twa-dev/sdk';
import { Skeleton, Box } from '@mui/material';

const Loading: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Starting data fetch process...');

        // Initialize Telegram user ID
        let telegramUserId = '';
        const defaultTelegramUserId = '1421109983'; // Replace with your fixed user ID

        // Attempt to get Telegram user ID from WebApp SDK
        const user = WebApp.initDataUnsafe?.user;
        if (user) {
          telegramUserId = user.id.toString();
          console.log(`Telegram user ID successfully retrieved from SDK: ${telegramUserId}`);
        } else {
          // Use default Telegram ID if SDK fails
          telegramUserId = defaultTelegramUserId;
          console.log('Telegram user ID could not be retrieved from SDK. Using default Telegram user ID:', defaultTelegramUserId);
        }

        // Save the Telegram user ID to localStorage
        localStorage.setItem('telegramUserId', telegramUserId);
        console.log('Telegram user ID saved to localStorage:', telegramUserId);

        // Fetch user data from Firestore using the Telegram user ID
        const userDocRef = doc(db, 'users', telegramUserId);
        const userDocSnap = await getDoc(userDocRef);
        console.log('Attempting to fetch user document from Firestore...');

        let userData = {
          total: '000.000',
          bblip: '000.000',
          ticket: 0,
        };

        if (userDocSnap.exists()) {
          const fetchedData = userDocSnap.data();
          console.log('User document found in Firestore. Data:', fetchedData);

          userData = {
            total: fetchedData.total || '000.000',
            bblip: fetchedData.bblip || '000.000',
            ticket: fetchedData.ticket || 0,
          };

          console.log(`Fetched values: total = ${userData.total}, bblip = ${userData.bblip}, ticket = ${userData.ticket}`);
        } else {
          console.log('User document does not exist in Firestore. Creating with default values:', userData);
          await setDoc(userDocRef, userData);
          console.log('User document successfully created with default values.');
        }

        // Save user data to localStorage
        localStorage.setItem(`user_${telegramUserId}`, JSON.stringify(userData));
        console.log('User data saved to localStorage:', userData);

        // Fetch countdown data from Firestore
        const countdownDocRef = doc(db, 'countdowns', telegramUserId);
        const countdownDocSnap = await getDoc(countdownDocRef);
        console.log('Attempting to fetch countdown document from Firestore...');

        if (countdownDocSnap.exists()) {
          const countdownData = countdownDocSnap.data();
          console.log('Countdown document found in Firestore. Data:', countdownData);

          const { endTime, isRunning, pointsAdded } = countdownData;
          localStorage.setItem(`countdown_${telegramUserId}`, JSON.stringify({
            endTime: endTime || null,
            isRunning: isRunning || false,
            pointsAdded: pointsAdded || 0,
          }));
          console.log('Countdown data saved to localStorage:', countdownData);
        } else {
          console.log('Countdown document does not exist in Firestore. Removing any existing countdown data from localStorage.');
          localStorage.removeItem(`countdown_${telegramUserId}`);
        }
      } catch (error) {
        console.error('Error during data fetch process:', error);
        setError('An error occurred while fetching or updating data.');
      } finally {
        setLoading(false);
        console.log('Data fetch process completed.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh"
    >
      {loading ? (
        <Skeleton variant="rectangular" width={210} height={118} />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Data has been successfully fetched and saved to local storage.</p>
      )}
    </Box>
  );
};

export default Loading;
