import React, { useCallback } from 'react';

// Import AdsGram types for better type safety
import type { AdController, ShowPromiseResult } from './adsgram';
import { Button } from '@mui/material';

const ShowAdButton: React.FC = () => {
  // Reward and error callback types
  const onReward = useCallback((result: ShowPromiseResult) => {
    alert('Ad rewarded!');
  }, []);

  const onError = useCallback((error: any) => {
    alert(`Error: ${JSON.stringify(error)}`);
  }, []);

  const showAd = useCallback(() => {
    // Initialize the AdsGram controller
    const AdController: AdController | undefined = window.Adsgram?.init({ blockId: '6760' });
    
    if (AdController) {
      AdController.show().then(onReward).catch(onError);
    } else {
      onError({ error: true, message: 'Ad not loaded' });
    }
  }, [onReward, onError]);

  return <Button onClick={showAd}>Show Ad</Button>;
};

export default ShowAdButton;
