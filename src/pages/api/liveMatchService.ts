import { apiClient } from './api'; // API-Football istemcisi
import { db } from '../firebase'; // Firebase bağlantısı
import { doc, updateDoc } from 'firebase/firestore';

export const fetchAndUpdateLiveMatch = async (matchId: string, homeTeam: string, awayTeam: string) => {
  try {
    const response = await apiClient.get('/fixtures', {
      params: { live: 'all' },
    });

    const matches = response.data.response;
    const liveMatch = matches.find((m: any) =>
      m.teams.home.name.toLowerCase() === homeTeam.toLowerCase() &&
      m.teams.away.name.toLowerCase() === awayTeam.toLowerCase()
    );

    if (liveMatch) {
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, {
        liveData: {
          goals: liveMatch.goals,
          elapsed: liveMatch.fixture.status.elapsed,
          status: liveMatch.fixture.status.long,
        },
        homeTeamLogo: liveMatch.teams.home.logo,
        awayTeamLogo: liveMatch.teams.away.logo,
        leagueName: liveMatch.league.name,  // Lig adını ekliyoruz
        matchId: liveMatch.fixture.id // Maç ID'sini de ekliyoruz
      });
      console.log('Canlı maç bilgileri ve logolar güncellendi.');
      return liveMatch.fixture.id; // Maç ID'sini geri döndür
    } else {
      console.log('Canlı maç bulunamadı.');
      return null; // Eğer maç bulunmazsa null döndür
    }
  } catch (error) {
    console.error('Hata: Canlı maç bilgileri alınamadı.', error);
    return null;
  }
};
