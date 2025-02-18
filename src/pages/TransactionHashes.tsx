import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { getUserData } from '../utils/cacheManager';

// Styled component for a card container
const CardContainer = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  overflow: "hidden",
}));

// Interface for transaction details
interface TransactionDetails {
  status: string;
  amount: string;
  timestamp: string;
}

const TransactionHashes: React.FC = () => {
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);
  const [transactionDetails, setTransactionDetails] = useState<Record<string, TransactionDetails>>({});
  const [loading, setLoading] = useState(true);

  // Function to fetch transaction details for the given hashes
  const fetchTransactionDetails = async (hashes: string[]) => {
    const details: Record<string, TransactionDetails> = {};
    for (const hash of hashes) {
      try {
        const encodedHash = encodeURIComponent(hash);
        const response = await axios.get(`https://tonapi.io/v2/blockchain/transactions/${encodedHash}`);
        const data = response.data;

        details[hash] = {
          status: data.success ? "Completed" : "Failed", // Success status
          amount: `${data.credit_phase.credit / 1000000000} TON`, // Amount in TON
          timestamp: new Date(data.utime * 1000).toLocaleString(), // Timestamp conversion
        };
      } catch (error) {
        console.error(`Error fetching details for hash ${hash}:`, error);
      }
    }
    setTransactionDetails(details); // Update state with transaction details
  };

  const fetchTransactionHashes = async () => {
    try {
      const telegramUserId = localStorage.getItem("telegramUserId") || "7046348699";
      const userData = await getUserData(telegramUserId);
      
      if (userData) {
        const hashes = Array.isArray(userData.transaction_hashes) ? userData.transaction_hashes : [];
        if (JSON.stringify(hashes) !== JSON.stringify(transactionHashes)) {
          setTransactionHashes(hashes);
          if (hashes.length > 0) {
            await fetchTransactionDetails(hashes);
          }
        }
      } else {
        setTransactionHashes([]);
      }
    } catch (error) {
      console.error("Error fetching transaction hashes:", error);
      setTransactionHashes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHashes();
    // Refresh data every minute
    const interval = setInterval(fetchTransactionHashes, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box component="div" display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box //@ts-ignore
    sx={{ padding: 1 }}>
      <Typography fontWeight={"bold"} variant="body1" gutterBottom textAlign={'center'}>
        Last transactions
      </Typography>
      {transactionHashes.length > 0 ? (
        transactionHashes
          .slice() // Copy the array to avoid mutation
          .reverse() // Reverse to show the most recent first
          .map((hash, index) => (
            <CardContainer key={index}>
              <CardContent>
                <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                  <strong>Tx:</strong> {hash.slice(0, 10)}...{hash.slice(-12)} 
                </Typography>

                {transactionDetails[hash] ? (
                  <Box mt={2}>
                    <Typography variant="body2">
                      <strong>Status:</strong> {transactionDetails[hash].status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Amount:</strong> {transactionDetails[hash].amount}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Timestamp:</strong> {transactionDetails[hash].timestamp}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2">Loading transaction details...</Typography>
                )}
              </CardContent>
            </CardContainer>
          ))
      ) : (
        <Typography textAlign={"center"} variant="body1" sx={{color:'gray'}}>You don't have any transactions yet</Typography>
      )}
    </Box>
  );
};

export default TransactionHashes;
