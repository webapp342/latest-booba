import { apiClient } from './api'; // API-Football istemcisi
import { db } from '../firebase'; // Firebase bağlantısı
import { doc, updateDoc } from 'firebase/firestore';

export const fetchAndUpdateLiveMatch = async (matchId: string, homeTeam: string, awayTeam: string) => {
  console.log('fetchAndUpdateLiveMatch başladı. Parametreler:', { matchId, homeTeam, awayTeam });
  
  try {
    console.log('API çağrısı başlatılıyor...');
    const response = await apiClient.get('/fixtures', {
      params: { live: 'all' },
    });
    console.log('API çağrısı tamamlandı. Gelen veri:', response.data);

    const matches = response.data.response;
    console.log('Canlı maçlar filtreleniyor...');
    const liveMatch = matches.find((m: any) =>
      m.teams.home.name.toLowerCase() === homeTeam.toLowerCase() &&
      m.teams.away.name.toLowerCase() === awayTeam.toLowerCase()
    );

    if (liveMatch) {
      console.log('Canlı maç bulundu:', liveMatch);
      
      const matchRef = doc(db, 'matches', matchId);
      console.log('Firestore referansı alındı:', matchRef);

      console.log('Firestore güncellemesi başlatılıyor...');
      await updateDoc(matchRef, {
        liveData: {
          goals: liveMatch.goals,
          elapsed: liveMatch.fixture.status.elapsed,
          status: liveMatch.fixture.status.long,
        },
        homeTeamLogo: liveMatch.teams.home.logo,
        awayTeamLogo: liveMatch.teams.away.logo,
        leagueName: liveMatch.league.name,
        matchId: liveMatch.fixture.id,
      });
      console.log('Firestore güncellemesi tamamlandı.');
      return liveMatch.fixture.id;
    } else {
      console.log('Canlı maç bulunamadı.');
      return null;
    }
  } catch (error) {
    console.error('Hata: Canlı maç bilgileri alınamadı.', error);
    return null;
  }
};
