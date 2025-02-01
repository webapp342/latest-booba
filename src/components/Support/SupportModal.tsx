import React from 'react';
import { PaginatedSupportChat } from './PaginatedSupportChat';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export const SupportModal: React.FC<SupportModalProps> = (props) => {
  return <PaginatedSupportChat {...props} />;
}; 