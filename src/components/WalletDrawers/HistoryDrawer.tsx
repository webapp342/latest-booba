import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Drawer,
  styled,
  Button,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { getTransactionData } from '../../utils/cacheManager';

const StyledDrawer = styled(Drawer)(({ }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
    borderRadius: '24px 24px 0 0',
    padding: '24px',
    maxHeight: '100vh',
    minHeight: '60vh',
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

interface Deposit {
  amount: number;
  timestamp: number;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ open, onClose }) => {
  const [transactions, setTransactions] = useState<Record<string, Transaction>>({});
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'withdrawals' | 'deposits'>('withdrawals');

  const fetchTransactions = async () => {
    try {
      const telegramUserId = localStorage.getItem("telegramUserId");
      if (!telegramUserId) {
        console.error("Telegram User ID not found!");
        return;
      }

      const transactionData = await getTransactionData(telegramUserId);
      setTransactions(transactionData.fields);
      setDeposits(transactionData.deposits);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTransactions();
      // Refresh data every 30 seconds while drawer is open
      const interval = setInterval(fetchTransactions, 30000);
      return () => clearInterval(interval);
    }
  }, [open]);

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: 'withdrawals' | 'deposits') => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const pendingTransactions = Object.entries(transactions)
    .filter(([_, tx]) => !tx.completed)
    .sort(([a], [b]) => Number(b) - Number(a));

  const completedTransactions = Object.entries(transactions)
    .filter(([_, tx]) => tx.completed)
    .sort(([a], [b]) => Number(b) - Number(a));

  const sortedDeposits = [...deposits].sort((a, b) => b.timestamp - a.timestamp);

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
      <DrawerHeader mx={-2}>
        <Button
          onClick={onClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { color: '#fff' },
            minWidth: '40px',
            padding: '8px'
          }}
        >
          <CloseIcon fontSize="medium" />
        </Button>
        <Typography 
          variant="h6" 
          sx={{ 
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            opacity: 0.7,
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}
        >
          Transaction History
        </Typography>
        <Box sx={{ width: 40 }} />
      </DrawerHeader>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          sx={{
            backgroundColor: 'rgba(110, 211, 255, 0.05)',
            border: '1px solid rgba(110, 211, 255, 0.1)',
            borderRadius: '12px',
            '& .MuiToggleButton-root': {
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              '&.Mui-selected': {
                backgroundColor: 'rgba(110, 211, 255, 0.1)',
                color: '#6ed3ff',
              },
              '&:hover': {
                backgroundColor: 'rgba(110, 211, 255, 0.15)',
              },
            },
          }}
        >
          <ToggleButton 
            value="withdrawals"
            sx={{ px: 3, py: 1, display: 'flex', gap: 1,textTransform: 'none' }}
          >
            <ArrowUpCircle size={18} />
            Withdrawals
          </ToggleButton>
          <ToggleButton 
            value="deposits"
            sx={{ px: 3, py: 1, display: 'flex', gap: 1,textTransform: 'none' }}
          >
            <ArrowDownCircle size={18} />
            Deposits
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, '&::-webkit-scrollbar': { display: 'none' } }}>
          <CircularProgress sx={{ color: '#6ed3ff' }} />
        </Box>
      ) : view === 'withdrawals' ? (
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
                No withdrawals yet
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Your withdrawal history will appear here
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ overflow: 'auto' }}>
          {sortedDeposits.length > 0 ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                <Typography sx={{ color: '#4caf50', fontWeight: 600 }}>
                  Deposit History
                </Typography>
              </Box>
              {sortedDeposits.map((deposit, index) => (
                <TransactionItem key={index}>
                  <Box>
                    <Typography sx={{ color: '#fff', mb: 0.5 }}>
                      Deposit
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {new Date(deposit.timestamp * 1000).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                      {deposit.amount} TON
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
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '50vh',
              opacity: 0.6
            }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                No deposits yet
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Your deposit history will appear here
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </StyledDrawer>
  );
};

export default HistoryDrawer; 