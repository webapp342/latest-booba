import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import WebApp from '@twa-dev/sdk';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const Loading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [circularProgress, setCircularProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const progressRef = useRef(() => {});

  useEffect(() => {
    progressRef.current = () => {
      if (progress >= 100) {
        setProgress(100);
        setBuffer(100);
      } else {
        const increment = 100 / 30; // Progress completes in 3 seconds
        setProgress(prev => Math.min(prev + increment, 100));
        setBuffer(prev => Math.min(prev + increment + Math.random() * 5, 100));
      }
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCircularProgress(prev => (prev >= 100 ? 0 : prev + 10));
    }, 300);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Starting data fetch process...');

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
      flexDirection="column"
    >
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <Box sx={{ width: '80%', marginBottom: 4 }}>
            <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
          </Box>
          <CircularProgressWithLabel value={circularProgress} />
        </>
      )}
    </Box>
  );
};

export default Loading;
