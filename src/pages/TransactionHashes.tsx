import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Box, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

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

  // Function to fetch transaction hashes from Firestore
  const fetchTransactionHashes = () => {
    const telegramUserId = localStorage.getItem("telegramUserId") || "7046348699";
    const docRef = doc(db, "users", telegramUserId);

    onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const hashes = Array.isArray(data?.transaction_hashes) ? data.transaction_hashes : [];

        // Only update state if the hashes are different
        if (JSON.stringify(hashes) !== JSON.stringify(transactionHashes)) {
          setTransactionHashes(hashes);

          if (hashes.length > 0) {
            await fetchTransactionDetails(hashes); // Fetch details for new hashes
          }
        }
        setLoading(false);
      } else {
        setTransactionHashes([]); // No document, set empty hashes
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchTransactionHashes(); // Fetch hashes only once on component mount
  }, []); // Empty dependency array ensures this only runs once

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 1 }}>
      <Typography fontWeight={"bold"} variant="body1" gutterBottom textAlign={'center'}>
        Latest Deposits
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
        <Typography textAlign={"center"} variant="body1">You don't have any transactions yet.</Typography>
      )}
    </Box>
  );
};

export default TransactionHashes;
