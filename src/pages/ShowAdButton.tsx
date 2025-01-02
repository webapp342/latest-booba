import React from 'react';
import { useAdsgram } from './useAdsgram';
import { Button } from '@mui/material';

const ShowAdButton: React.FC = () => {
  const onReward = () => alert('Ad rewarded!');
  const onError = (error: any) => alert(`Error: ${JSON.stringify(error)}`);

  const showAd = useAdsgram({ blockId: '6760', onReward, onError });

  return <Button onClick={showAd}>Show Ad</Button>;
};

export default ShowAdButton;
