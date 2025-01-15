import { useCallback, ReactElement } from 'react'
import { useAdsgram } from "./useAdsgram";
import { ShowPromiseResult } from "./adsgram";
import { updateUserBblip } from '../utils/database';


export function ShowAdButton(): ReactElement {
  const onReward = useCallback(() => {
    alert('Congratulations, your reward has been added to your wallet');
    updateUserBblip(1000).catch((error) => {
      console.error('Bblip güncellenirken hata oluştu:', error);
      alert('Bblip güncellenirken bir hata oluştu.');
    });
  }, []);
  const onError = useCallback((result: ShowPromiseResult) => {
    alert(JSON.stringify(result, null, 4));
  }, []);

  /**
   * insert your-block-id
   */
  const showAd = useAdsgram({ blockId: "6760", onReward, onError });

  return (
    <button onClick={showAd}>Show Ad</button>
  )
}