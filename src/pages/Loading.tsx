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
        console.log('Starting data fetch process...');

        // Clear all localStorage data at the start
        localStorage.clear();
        console.log('localStorage cleared.');

        let telegramUserId = '';
        const defaultTelegramUserId = '1421109983';

        const user = WebApp.initDataUnsafe?.user;
        if (user) {
          telegramUserId = user.id.toString();
          console.log(`Telegram user ID retrieved: ${telegramUserId}`);
        } else {
          telegramUserId = defaultTelegramUserId;
          console.log('Using default Telegram user ID:', defaultTelegramUserId);
        }

        localStorage.setItem('telegramUserId', telegramUserId);

        // Fetch countdown data
        const countdownDocRef = doc(db, 'countdowns', telegramUserId);
        const countdownDocSnap = await getDoc(countdownDocRef);

        if (countdownDocSnap.exists()) {
          const countdownData = countdownDocSnap.data();
          localStorage.setItem(`countdown_${telegramUserId}`, JSON.stringify(countdownData));
          console.log('Countdown data saved to localStorage:', countdownData);
        }

        // Fetch transaction_hashes data
        const transactionHashesDocRef = doc(db, 'transaction_hashes', telegramUserId);
        const transactionHashesDocSnap = await getDoc(transactionHashesDocRef);

        if (transactionHashesDocSnap.exists()) {
          const transactionHashesData = transactionHashesDocSnap.data();
          localStorage.setItem(`transaction_hashes_${telegramUserId}`, JSON.stringify(transactionHashesData));
          console.log('Transaction hashes data saved to localStorage:', transactionHashesData);
        }

        // Fetch comment data
        const commentDocRef = doc(db, 'comments', telegramUserId);
        const commentDocSnap = await getDoc(commentDocRef);

        if (commentDocSnap.exists()) {
          const commentData = commentDocSnap.data();
          localStorage.setItem(`comment_${telegramUserId}`, JSON.stringify(commentData));
          console.log('Comment data saved to localStorage:', commentData);
        }

        // Fetch invitedUsers data
        const invitedUsersDocRef = doc(db, 'invitedUsers', telegramUserId);
        const invitedUsersDocSnap = await getDoc(invitedUsersDocRef);

        if (invitedUsersDocSnap.exists()) {
          const invitedUsersData = invitedUsersDocSnap.data();
          localStorage.setItem(`invitedUsers_${telegramUserId}`, JSON.stringify(invitedUsersData));
          console.log('Invited users data saved to localStorage:', invitedUsersData);
        } else {
          console.log('No invited users document found.');
          localStorage.setItem(`invitedUsers_${telegramUserId}`, 'null');
        }
      } catch (error) {
        console.error('Error during data fetch:', error);
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
