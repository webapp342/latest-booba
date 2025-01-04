// MatchesList.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Firebase bağlantısını buradan alıyoruz

const MatchesList: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'matches')); // Firestore'dan verileri çekiyoruz
        const matchesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div>
      <h1>Matches</h1>
      {matches.map((match) => (
        <div key={match.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h2>{match.league}</h2>
          <p>{new Date(match.date).toLocaleString()}</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={match.homeTeam.logo} alt={match.homeTeam.name} width="50" />
            <span style={{ margin: '0 10px' }}>{match.homeTeam.name}</span>
            <span>vs</span>
            <span style={{ margin: '0 10px' }}>{match.awayTeam.name}</span>
            <img src={match.awayTeam.logo} alt={match.awayTeam.name} width="50" />
          </div>
          <div>
            <p>Home Win: {match.odds.homeWin}</p>
            <p>Draw: {match.odds.draw}</p>
            <p>Away Win: {match.odds.awayWin}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchesList;
