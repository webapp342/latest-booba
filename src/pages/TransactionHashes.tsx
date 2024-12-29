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

const TransactionHashes: React.FC = () => {
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);
  const [transactionDetails, setTransactionDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch transaction hashes and details from Firebase and TON API
  useEffect(() => {
    const fetchTransactionHashes = async () => {
      try {
        setLoading(true);
        const telegramUserId = localStorage.getItem("telegramUserId") || "1421109983";

        const docRef = doc(db, "users", telegramUserId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const hashes = Array.isArray(data?.transaction_hashes)
            ? data.transaction_hashes
            : [];
          setTransactionHashes(hashes);
          fetchTransactionDetails(hashes); // Fetch details for each hash
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

    const fetchTransactionDetails = async (hashes: string[]) => {
      try {
        const details = await Promise.all(
          hashes.map(async (hash) => {
            const response = await fetch(`https://tonapi.io/api/v1/transactions/${hash}`);
            const data = await response.json();
            return data;
          })
        );
        setTransactionDetails(details);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };

    fetchTransactionHashes();
  }, []);

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
        transactionHashes.map((hash, index) => (
          <CardContainer key={index}>
            <CardContent>
              <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                {hash}
              </Typography>
              {transactionDetails[index] && (
                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="body2">
                    <strong>Details:</strong>
                  </Typography>
                  <Typography variant="body2">
                    Status: {transactionDetails[index].status}
                  </Typography>
                  <Typography variant="body2">
                    Value: {transactionDetails[index].value}
                  </Typography>
                  <Typography variant="body2">
                    Sender: {transactionDetails[index].sender}
                  </Typography>
                  <Typography variant="body2">
                    Receiver: {transactionDetails[index].receiver}
                  </Typography>
                  {/* Add more details as necessary */}
                </Box>
              )}
            </CardContent>
          </CardContainer>
        ))
      ) : (
        <Typography variant="body1">No transaction hashes found.</Typography>
      )}
    </Box>
  );
};

export default TransactionHashes;
