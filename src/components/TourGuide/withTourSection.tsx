import React from 'react';
import { Box } from '@mui/material';

interface WithTourSectionProps {
  sectionId: string;
  children: React.ReactNode;
}

export const WithTourSection: React.FC<WithTourSectionProps> = ({ sectionId, children }) => {
  return (
    <Box data-tour={sectionId} sx={{ height: '100%' }}>
      {children}
    </Box>
  );
};

export default WithTourSection; 