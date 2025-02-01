import React from 'react';
import TwoFieldsComponent from '../../pages/TwoFieldsComponent';

interface WithdrawDrawerProps {
  open: boolean;
  onClose: () => void;
}

const WithdrawDrawer: React.FC<WithdrawDrawerProps> = ({ open, onClose }) => {
  return (
    <TwoFieldsComponent 
      open={open}
      onClose={onClose}
    />
  );
};

export default WithdrawDrawer; 