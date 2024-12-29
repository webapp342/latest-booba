import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Box, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import { styled } from "@mui/system";

// Styled component for a card container
const CardContainer = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  overflow: "hidden",
}));

interface TransactionDetails {
  hash: string;
  status: string;
  value: string;
  timestamp: string;
}

const TransactionHashes: React.FC = () => {
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionHashes = async () => {
      try {
        setLoading(true);
        const telegramUserId = localStorage.getItem("telegramUserId") || "1421109983";

        const docRef = doc(db, "users", telegramUserId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const hashes = Array.isArray(data?.transaction_hashes) ? data.transaction_hashes : [];
          setTransactionHashes(hashes);
          
          // Fetch transaction details for each hash from TON blockchain API
          const details = await Promise.all(hashes.map(async (hash) => {
            return fetchTransactionDetails(hash); // Fetch details from TON blockchain API
          }));
          setTransactionDetails(details);
        } else {
          console.log("No such document!");
          setTransactionHashes([]);
        }
      } catch (error) {
        console.error("Error fetching transaction hashes:", error);
        setTransactionHashes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHashes();
  }, []);

  const fetchTransactionDetails = async (hash: string): Promise<TransactionDetails> => {
    // Replace with actual request to TON blockchain or TON API
    try {
      const response = await fetch(`https://toncenter.com/api/v2/getTransaction?tx=${hash}`);
      const data = await response.json();

      if (data.error) {
        return {
          hash,
          status: "Failed to fetch",
          value: "0",
          timestamp: "N/A",
        };
      }

      const value = data.result?.value ? data.result.value : "0";
      const status = data.result?.status || "Unknown";
      const timestamp = data.result?.timestamp || "Unknown";

      return {
        hash,
        status,
        value,
        timestamp,
      };
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      return {
        hash,
        status: "Failed to fetch",
        value: "0",
        timestamp: "N/A",
      };
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Transaction Hashes
      </Typography>
      {transactionHashes.length > 0 ? (
  transactionHashes.map((hash, index) => {
  const details = transactionDetails[index];
  return (
    <CardContainer key={index}>
      <CardContent>
        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
          <strong>Hash:</strong> {hash} {/* Use the hash here */}
        </Typography>
        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
          <strong>Status:</strong> {details.status}
        </Typography>
        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
          <strong>Value:</strong> {details.value} TON
        </Typography>
        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
          <strong>Timestamp:</strong> {details.timestamp}
        </Typography>
      </CardContent>
    </CardContainer>
  );
})


      ) : (
        <Typography variant="body1">No transaction hashes found.</Typography>
      )}
    </Box>
  );
};

export default TransactionHashes;
