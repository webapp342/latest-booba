import React, { useEffect, useState } from 'react';

interface CompetitionInfo {
  name: string;
  region: string;
  country: string;
  sport: string;
}

const CompetitionDetails: React.FC = () => {
  const [data, setData] = useState<CompetitionInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };

    fetch(
      'https://api.sportradar.com/soccer/trial/v4/en/competitions/sr%3Acompetition%3A17/info.json?api_key=X1EtD4fMbO5e8l020JkvEp1UuS2e5sWFabsVOUFC',
      options
    )
      .then((res) => res.json())
      .then((data) => {
        setData({
          name: data.name,
          region: data.region,
          country: data.country,
          sport: data.sport,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {data ? (
        <div>
          <h2>Competition Details</h2>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Region:</strong> {data.region}</p>
          <p><strong>Country:</strong> {data.country}</p>
          <p><strong>Sport:</strong> {data.sport}</p>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default CompetitionDetails;
