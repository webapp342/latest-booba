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
        // Get Telegram user data using the Telegram Web App SDK
        const user = WebApp.initDataUnsafe?.user;
        if (!user) {
          throw new Error('Telegram user data is not available');
        }

        const telegramUserId = user.id.toString();

        // Save user ID to localStorage
        localStorage.setItem('telegramUserId', telegramUserId);

        // Fetch data from Firestore's 'users' collection
        const userDocRef = doc(db, 'users', telegramUserId);
        const userDocSnap = await getDoc(userDocRef);

        let userData = {
          total: '000.000',
          bblip: '000.000',
          ticket: 0,
        };

        if (userDocSnap.exists()) {
          const fetchedData = userDocSnap.data();
          userData = {
            total: fetchedData.total || '000.000',
            bblip: fetchedData.bblip || '000.000',
            ticket: fetchedData.ticket || 0,
          };
        }

        // Save user data to localStorage
        localStorage.setItem(`user_${telegramUserId}`, JSON.stringify(userData));

        // Fetch data from Firestore's 'countdowns' collection
        const countdownDocRef = doc(db, 'countdowns', telegramUserId);
        const countdownDocSnap = await getDoc(countdownDocRef);

        let countdownData;
        if (countdownDocSnap.exists()) {
          countdownData = countdownDocSnap.data();

          // Check if fields exist and save them to localStorage
          const { endTime, isRunning, pointsAdded } = countdownData;
          localStorage.setItem(`countdown_${telegramUserId}`, JSON.stringify({
            endTime: endTime || null,
            isRunning: isRunning || false,
            pointsAdded: pointsAdded || 0,
          }));
        } else {
          // If the document does not exist, skip saving countdown data
          localStorage.removeItem(`countdown_${telegramUserId}`);
        }
      } catch (error) {
        console.error('Error fetching or updating user data:', error);
        setError('An error occurred while fetching or updating data.');
      } finally {
        setLoading(false);
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
