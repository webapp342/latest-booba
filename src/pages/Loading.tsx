import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import WebApp from '@twa-dev/sdk';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#1a2126',
  color: '#fff',
  position: 'relative',
});

const SpinnerContainer = styled(Box)({
  position: 'relative',
  width: '70px',
  height: '70px',
  marginBottom: '2rem',
});

const Spinner = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  border: '3px solid rgba(255, 255, 255, 0.1)',
  borderTop: '3px solid #fff',
  borderRadius: '50%',
  animation: `${rotate} 1s linear infinite`,
  boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
});

const LoadingText = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.8)',
  letterSpacing: '0.1em',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4rem',
});

const Dots = styled('span')({
  display: 'inline-block',
  width: '24px',
  '&::after': {
    content: '"..."',
    animation: `${blink} 1s steps(4, end) infinite`,
  },
});

const TypographyContainer = styled(Box)({
  position: 'absolute',
  bottom: '3rem',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '300px',
});

const TypingText = styled(Typography)<{ delay: string }>(({ delay }) => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  margin: '0 auto',
  letterSpacing: '0.15em',
  animation: `${typing} 1s steps(40, end)`,
  animationDelay: delay,
  animationFillMode: 'both',
}));

const SubText = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1rem',
  '& > *': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
});

const Loading: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let telegramUserId = '';
        const defaultTelegramUserId = '7046348699';

        const user = WebApp.initDataUnsafe?.user;
        if (user) {
          telegramUserId = user.id.toString();
        } else {
          telegramUserId = defaultTelegramUserId;
        }

        localStorage.setItem('telegramUserId', telegramUserId);

        // Fetch transaction_hashes data
        const transactionHashesDocRef = doc(db, 'transaction_hashes', telegramUserId);
        const transactionHashesDocSnap = await getDoc(transactionHashesDocRef);

        if (transactionHashesDocSnap.exists()) {
          const transactionHashesData = transactionHashesDocSnap.data();
          localStorage.setItem(`transaction_hashes_${telegramUserId}`, JSON.stringify(transactionHashesData));
        }

        // Fetch comment data
        const commentDocRef = doc(db, 'comments', telegramUserId);
        const commentDocSnap = await getDoc(commentDocRef);

        if (commentDocSnap.exists()) {
          const commentData = commentDocSnap.data();
          localStorage.setItem(`comment_${telegramUserId}`, JSON.stringify(commentData));
        }

        // Fetch invitedUsers data
        const invitedUsersDocRef = doc(db, 'invitedUsers', telegramUserId);
        const invitedUsersDocSnap = await getDoc(invitedUsersDocRef);

        if (invitedUsersDocSnap.exists()) {
          const invitedUsersData = invitedUsersDocSnap.data();
          localStorage.setItem(`invitedUsers_${telegramUserId}`, JSON.stringify(invitedUsersData));
        } else {
          localStorage.setItem(`invitedUsers_${telegramUserId}`, 'null');
        }
      } catch (error) {
        console.error('Error during data fetch:', error);
        setError('An error occurred while fetching data');
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return (
      <LoadingContainer>
        <Typography variant="h6" sx={{ color: '#EF4444' }}>
          {error}
        </Typography>
      </LoadingContainer>
    );
  }

  return (
    <LoadingContainer>
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
      <LoadingText>
        Loading<Dots />
      </LoadingText>
      <TypographyContainer>
        <TypingText 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            fontSize: '2.5rem',
            color: '#fff',
          }}
          delay="0s"
        >
          FUN.
        </TypingText>
        <SubText>
          <TypingText 
            variant="h6"
            sx={{ 
              fontWeight: 500,
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
            delay="1s"
          >
            FREEDOM.
          </TypingText>
          <TypingText 
            variant="h6"
            sx={{ 
              fontWeight: 500,
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
            delay="2s"
          >
            FUTURE.
          </TypingText>
        </SubText>
      </TypographyContainer>
    </LoadingContainer>
  );
};

export default Loading;
