import React from 'react';
import { Typography, Box } from '@mui/material';
import { Match } from './match';

interface MatchHeaderProps {
  match: Match;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({ match }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">Match Details</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2, textAlign:'center' }}>
        Date: {new Date(match.date).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default MatchHeader;