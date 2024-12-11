import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styles } from './styles';
import { Box, Typography } from '@mui/material';

interface HistoryEntry {
  spinType: string;
  balanceType: string;
  amount: string;
}

interface HistoryDisplayProps {
  history: HistoryEntry[];
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history }) => {
  const getLogo = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ton':
        return 'https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040';
      case 'bblip':
        return 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040';
      case 'ticket':
        return 'https://cryptologos.cc/logos/trezarcoin-tzc-logo.png?v=040';
      default:
        return ''; // If it's not one of the three, don't display a logo
    }
  };

  // Function to format the amount with at least 4 digits and a dot as thousand separator
  const formatAmount = (amount: string) => {
    const paddedAmount = amount.padStart(6, '0'); // Ensure at least 6 digits with leading zeros
    const integerPart = paddedAmount.slice(0, 3); // First 3 digits
    const decimalPart = paddedAmount.slice(3); // Last 3 digits
    const formattedAmount = `${parseInt(integerPart, 10)}.${decimalPart}`; // Remove leading zeros in integer part
    return formattedAmount;
  };

  return (
    <Box
      sx={{
        margin: '0 ',
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        backgroundColor: 'whitesmoke',
        textAlign: 'center',
        color: 'black',
      }}
    >

        <Typography >Results</Typography>

     
      {history.length === 0 ? (
        <p>No spins yet.</p>
      ) : (
        <ul style={styles.historyList}>
          {history.map((entry, index) => (
            <li key={index} style={styles.historyItem}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                {/* Left logo for spinType */}
                {entry.spinType.toLowerCase() === 'total' ? (
                  <img
                    src={getLogo('TON')} // Total related to TON logo
                    alt="Total"
                    style={{ ...styles.logo, marginRight: '8px' }} // Added margin to separate logo
                  />
                ) : entry.spinType.toLowerCase() === 'bblip' ? (
                  <img
                    src={getLogo('BBLIP')} // BBLIP logo
                    alt="BBLIP"
                    style={{ ...styles.logo, marginRight: '8px' }} // Added margin
                  />
                ) : entry.spinType.toLowerCase() === 'ticket' ? (
                  <img
                    src={getLogo('Ticket')} // Ticket logo
                    alt="Ticket"
                    style={{ ...styles.logo, marginRight: '8px' }} // Added margin
                  />
                ) : (
                  <strong>{entry.spinType}</strong> // Other spin types remain as text
                )}

                {/* Arrow Icon right after the logo */}
                <ArrowForwardIcon style={styles.arrowIcon} />

                {/* Amount and balanceType */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end', // Align to the right
                    flex: 1,
                  }}
                >
                  <div style={{ marginRight: '8px' }}>{formatAmount(entry.amount)}</div>
                  {entry.balanceType.toLowerCase() === 'total' ? (
                    <img
                      src={getLogo('TON')} // Balance related to TON logo
                      alt="Total Balance"
                      style={{ ...styles.logo, marginLeft: '0' }} // Removed margin
                    />
                  ) : entry.balanceType.toLowerCase() === 'bblip' ? (
                    <img
                      src={getLogo('BBLIP')} // Balance for BBLIP
                      alt="BBLIP Balance"
                      style={{ ...styles.logo, marginLeft: '0' }} // Removed margin
                    />
                  ) : entry.balanceType.toLowerCase() === 'ticket' ? (
                    <img
                      src={getLogo('Ticket')} // Ticket balance logo
                      alt="Ticket Balance"
                      style={{ ...styles.logo, marginLeft: '0' }} // Removed margin
                    />
                  ) : (
                    <strong>{entry.balanceType}</strong> // Other balance types remain as text
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
};

export default HistoryDisplay;
