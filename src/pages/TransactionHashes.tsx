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

 useEffect(() => {
  const fetchTransactionDetails = async (hashes: string[]) => {
    console.log("Starting to fetch transaction details...");
    const details: Record<string, TransactionDetails> = {};
    for (const hash of hashes) {
      try {
        console.log(`Fetching details for hash: ${hash}`);
        
        // URL encoding işlemi
        const encodedHash = encodeURIComponent(hash);
        console.log(`Encoded hash: ${encodedHash}`);
        
        // URL'ye encode edilmiş hash'i ekliyoruz
        const response = await axios.get(`https://tonapi.io/v2/blockchain/transactions/${encodedHash}`);
        const data = response.data;
        console.log("Transaction details data:", data);

        // Populate transaction details
        details[hash] = {
          status: data.success ? "Completed" : "Failed", // Success status
          amount: `${data.credit_phase.credit / 1000000000} TON`, // Amount (converted from subunits if needed)
          timestamp: new Date(data.utime * 1000).toLocaleString(), // Timestamp conversion to readable format
        };
      } catch (error) {
        console.error(`Error fetching details for hash ${hash}:`, error);
      }
    }
    setTransactionDetails(details);
    console.log("Transaction details fetched:", details);
  };

  const fetchTransactionHashes = () => {
    const telegramUserId = localStorage.getItem("telegramUserId") || "7046348699";
    console.log("Telegram User ID:", telegramUserId);

    const docRef = doc(db, "users", telegramUserId);

    // Listen for real-time changes in the Firestore document
    onSnapshot(docRef, async (docSnap) => {
      console.log("Firestore data has changed...");

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Document data:", data);

        // Check if transaction_hashes exist and is an array
        const hashes = Array.isArray(data?.transaction_hashes) ? data.transaction_hashes : [];
        console.log("Transaction hashes:", hashes);

        // Only set the new hashes if they're different from the previous ones
        setTransactionHashes(hashes);

        if (hashes.length > 0) {
          // Fetch transaction details only if there are hashes
          await fetchTransactionDetails(hashes);
        }
        setLoading(false); // Set loading to false once data is fetched or determined to be empty
      } else {
        console.log("No such document!");
        setTransactionHashes([]); // Set an empty array when document does not exist
        setLoading(false); // Set loading to false if document does not exist
      }
    });
  };

  fetchTransactionHashes(); // Start fetching data
}, [transactionHashes]); // Re-run when transactionHashes changes

if (loading) {
  console.log("Loading...");
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
}

console.log("Rendering transaction hashes...");
return (
  <Box sx={{ padding: 1 }}>
    <Typography fontWeight={"bold"} variant="body1" gutterBottom textAlign={'center'}>
      Last Transactions
    </Typography>
    {transactionHashes.length > 0 ? (
      transactionHashes
        .slice() // Array'in orijinalini değiştirmemek için kopyasını alıyoruz
        .reverse() // Diziyi ters çeviriyoruz
        .map((hash, index) => (
          <CardContainer key={index}>
            <CardContent>
              <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                <strong>Tx:</strong> {hash.slice(0, 10)}...{hash.slice(-12)} {" "}
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
      <Typography textAlign={"center"} variant="body1">You dont have any transaction yet.</Typography>
    )}
  </Box>
);

};

export default TransactionHashes;
