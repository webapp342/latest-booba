import { useCallback, ReactElement } from 'react'
import { useAdsgram } from "./useAdsgram.ts";
import { ShowPromiseResult } from "./adsgram";
import { Button } from '@mui/material';


export function ShowAdButton(): ReactElement {
  const onReward = useCallback(() => {
    alert('Reward');
  }, []);
  const onError = useCallback((result: ShowPromiseResult) => {
    alert(JSON.stringify(result, null, 4));
  }, []);

  /**
   * insert your-block-id
   */
  const showAd = useAdsgram({ blockId: "6760", onReward, onError });

  return (
    <Button onClick={showAd}>Show Ad</Button>
  )
}