// AdminPanel.tsx
import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase'; // Firebase bağlantısını buradan alıyoruz

const AdminPanel: React.FC = () => {
  const [formData, setFormData] = useState({
    league: '',
    date: '',
    homeTeam: '',
    homeLogo: '',
    awayTeam: '',
    awayLogo: '',
    homeWin: '',
    draw: '',
    awayWin: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const matchId = `${formData.homeTeam}_vs_${formData.awayTeam}_${formData.date}`;
    const data = {
      league: formData.league,
      date: formData.date,
      homeTeam: { name: formData.homeTeam, logo: formData.homeLogo },
      awayTeam: { name: formData.awayTeam, logo: formData.awayLogo },
      odds: {
        homeWin: parseFloat(formData.homeWin),
        draw: parseFloat(formData.draw),
        awayWin: parseFloat(formData.awayWin),
      },
    };

    try {
      await setDoc(doc(db, 'matches', matchId), data); // Verileri Firestore'a kaydediyoruz
      alert('Match added successfully!');
      setFormData({
        league: '',
        date: '',
        homeTeam: '',
        homeLogo: '',
        awayTeam: '',
        awayLogo: '',
        homeWin: '',
        draw: '',
        awayWin: '',
      });
    } catch (error) {
      console.error('Error adding match:', error);
      alert('Error adding match. Please try again.');
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <input name="league" placeholder="League" value={formData.league} onChange={handleInputChange} />
        <input name="date" type="datetime-local" value={formData.date} onChange={handleInputChange} />
        <input name="homeTeam" placeholder="Home Team" value={formData.homeTeam} onChange={handleInputChange} />
        <input name="homeLogo" placeholder="Home Logo URL" value={formData.homeLogo} onChange={handleInputChange} />
        <input name="awayTeam" placeholder="Away Team" value={formData.awayTeam} onChange={handleInputChange} />
        <input name="awayLogo" placeholder="Away Logo URL" value={formData.awayLogo} onChange={handleInputChange} />
        <input name="homeWin" placeholder="Home Win Odds" value={formData.homeWin} onChange={handleInputChange} />
        <input name="draw" placeholder="Draw Odds" value={formData.draw} onChange={handleInputChange} />
        <input name="awayWin" placeholder="Away Win Odds" value={formData.awayWin} onChange={handleInputChange} />
        <button onClick={handleSubmit}>Publish Match</button>
      </div>
    </div>
  );
};

export default AdminPanel;
