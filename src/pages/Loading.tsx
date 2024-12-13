import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import WebApp from '@twa-dev/sdk';
import { Skeleton, Box } from '@mui/material';

const Loading: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data...');

        // Try to get Telegram user data using the WebApp SDK
        let telegramUserId = '';

        const user = WebApp.initDataUnsafe?.user;
        if (user) {
          telegramUserId = user.id.toString();
          console.log(`Telegram user ID from SDK: ${telegramUserId}`);
        } else {
          // If WebApp SDK doesn't provide the user, use a fixed Telegram ID
          telegramUserId = '1421109983'; // Replace with your fixed user ID
          console.log(`Using fixed Telegram user ID: ${telegramUserId}`);
        }

        // Save the Telegram user ID to localStorage
        localStorage.setItem('telegramUserId', telegramUserId);
        console.log('Telegram user ID saved to localStorage');

        // Fetch user data from Firestore using the Telegram user ID
        const userDocRef = doc(db, 'users', telegramUserId);
        const userDocSnap = await getDoc(userDocRef);
        console.log('Fetched user document from Firestore');

        let userData = {
          total: '000.000',
          bblip: '000.000',
          ticket: 0,
        };

        if (userDocSnap.exists()) {
          const fetchedData = userDocSnap.data();
          console.log('User document exists, fetched data:', fetchedData);

          userData = {
            total: fetchedData.total || '000.000',
            bblip: fetchedData.bblip || '000.000',
            ticket: fetchedData.ticket || 0,
          };

          // Log the values of total, bblip, and ticket
          console.log(`Fetched values: total = ${userData.total}, bblip = ${userData.bblip}, ticket = ${userData.ticket}`);
        } else {
          console.log('User document does not exist, using default values');
        }

        // Save user data to localStorage
        localStorage.setItem(`user_${telegramUserId}`, JSON.stringify(userData));
        console.log('User data saved to localStorage:', userData);

        // Fetch countdown data from Firestore
        const countdownDocRef = doc(db, 'countdowns', telegramUserId);
        const countdownDocSnap = await getDoc(countdownDocRef);
        console.log('Fetched countdown document from Firestore');

        let countdownData;
        if (countdownDocSnap.exists()) {
          countdownData = countdownDocSnap.data();
          console.log('Countdown document exists, fetched data:', countdownData);

          // Check if fields exist and save them to localStorage
          const { endTime, isRunning, pointsAdded } = countdownData;
          localStorage.setItem(`countdown_${telegramUserId}`, JSON.stringify({
            endTime: endTime || null,
            isRunning: isRunning || false,
            pointsAdded: pointsAdded || 0,
          }));
          console.log('Countdown data saved to localStorage');
        } else {
          // If the document does not exist, skip saving countdown data
          localStorage.removeItem(`countdown_${telegramUserId}`);
          console.log('Countdown document does not exist, removed countdown data from localStorage');
        }
      } catch (error) {
        console.error('Error fetching or updating user data:', error);
        setError('An error occurred while fetching or updating data.');
      } finally {
        setLoading(false);
        console.log('Finished fetching data');
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
