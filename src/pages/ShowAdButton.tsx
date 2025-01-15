import { useCallback, ReactElement } from 'react'
import { useAdsgram } from "./useAdsgram";
import { ShowPromiseResult } from "./adsgram";


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
  const showAd = useAdsgram({ blockId: "5687", onReward, onError });

  return (
    <button onClick={showAd}>Show Ad</button>
  )
}