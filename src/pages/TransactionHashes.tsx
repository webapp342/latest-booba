import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const TransactionHashes: React.FC = () => {
  const [transactionHashes, setTransactionHashes] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionHashes = async () => {
      try {
        const telegramUserId = localStorage.getItem('telegramUserId') || 'default_user';

        const transactionHashesDocRef = doc(db, 'transaction_hashes', telegramUserId);
        const transactionHashesDocSnap = await getDoc(transactionHashesDocRef);

        if (transactionHashesDocSnap.exists()) {
          const data = transactionHashesDocSnap.data();
          setTransactionHashes(data.hashes || []);
        } else {
          setTransactionHashes([]);
        }
      } catch (error) {
        console.error('Error fetching transaction hashes:', error);
        setError('Failed to load transaction hashes.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHashes();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Transaction Hashes
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : transactionHashes && transactionHashes.length > 0 ? (
          <List>
            {transactionHashes.map((hash, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={hash} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No transaction hashes found.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default TransactionHashes;
