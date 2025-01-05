import React, { useEffect, useState } from "react";
import axios from "axios";

interface Match {
  utcDate: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
}

const UpcomingMatch: React.FC = () => {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = "58bea8ef5b404f259634a06f47d8263f"; // Buraya API anahtarınızı girin.
        const url = `https://api.football-data.org/v4/teams/81/matches?status=SCHEDULED`; // Barcelona'nın maçları
        const response = await axios.get(url, {
          headers: { "X-Auth-Token": apiKey },
        });

        const matches: Match[] = response.data.matches;
        const upcomingMatch = matches.find(
          (match) =>
            match.homeTeam.name === "Getafe" || match.awayTeam.name === "Getafe"
        );

        if (upcomingMatch) {
          setMatch(upcomingMatch);
        } else {
          setError("No upcoming matches between Barcelona and Getafe.");
        }
      } catch (err) {
        setError("Failed to fetch match data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return match ? (
    <div>
      <h3>Barcelona vs Getafe</h3>
      <p>Date: {new Date(match.utcDate).toLocaleDateString()}</p>
      <p>Time: {new Date(match.utcDate).toLocaleTimeString()}</p>
    </div>
  ) : (
    <p>No upcoming match found.</p>
  );
};

export default UpcomingMatch;
