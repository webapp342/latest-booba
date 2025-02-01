import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Drawer,
  styled,
  Button,
  CircularProgress,
} from '@mui/material';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { app } from '../../pages/firebaseConfig';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const db = getFirestore(app);

const StyledDrawer = styled(Drawer)(({ }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
    borderRadius: '24px 24px 0 0',
    padding: '24px',
    height: '70vh',
    border: '1px solid rgba(110, 211, 255, 0.1)',
  }
}));

const DrawerHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

const TransactionItem = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  marginBottom: '8px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface Transaction {
  field1: string; // address
  field2: string; // amount
  completed: boolean;
  timestamp?: number;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ open, onClose }) => {
  const [transactions, setTransactions] = useState<Record<string, Transaction>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      console.error("Telegram User ID not found!");
      return;
    }

    const docRef = doc(db, "users", telegramUserId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setTransactions(userData.fields || {});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const pendingTransactions = Object.entries(transactions)
    .filter(([_, tx]) => !tx.completed)
    .sort(([a], [b]) => Number(b) - Number(a));

  const completedTransactions = Object.entries(transactions)
    .filter(([_, tx]) => tx.completed)
    .sort(([a], [b]) => Number(b) - Number(a));

  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <StyledDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      <DrawerHeader>
        <Button
          onClick={onClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { color: '#fff' }
          }}
        >
          ✖
        </Button>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
          Transaction History
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Spacing için boş box */}
      </DrawerHeader>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#6ed3ff' }} />
        </Box>
      ) : (
        <Box sx={{ overflow: 'auto' }}>
          {pendingTransactions.length > 0 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
                <AccessTimeIcon sx={{ color: '#ff9800', mr: 1, fontSize: 20 }} />
                <Typography sx={{ color: '#ff9800', fontWeight: 600 }}>
                  Pending Transactions
                </Typography>
              </Box>
              {pendingTransactions.map(([id, tx]) => (
                <TransactionItem key={id}>
                  <Box>
                    <Typography sx={{ color: '#fff', mb: 0.5 }}>
                      {formatAddress(tx.field1)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {new Date(Number(id)).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                      {tx.field2} TON
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#ff9800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      Pending
                    </Typography>
                  </Box>
                </TransactionItem>
              ))}
            </>
          )}

          {completedTransactions.length > 0 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                <Typography sx={{ color: '#4caf50', fontWeight: 600 }}>
                  Completed Transactions
                </Typography>
              </Box>
              {completedTransactions.map(([id, tx]) => (
                <TransactionItem key={id}>
                  <Box>
                    <Typography sx={{ color: '#fff', mb: 0.5 }}>
                      {formatAddress(tx.field1)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {new Date(Number(id)).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                      {tx.field2} TON
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#4caf50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      Completed
                    </Typography>
                  </Box>
                </TransactionItem>
              ))}
            </>
          )}

          {!loading && pendingTransactions.length === 0 && completedTransactions.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '50vh',
              opacity: 0.6
            }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                No transactions yet
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Your withdrawal history will appear here
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </StyledDrawer>
  );
};

export default HistoryDrawer; 