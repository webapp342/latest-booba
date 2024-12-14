import { Container } from '@mui/material';
import React, { useState, useEffect } from 'react';

// Local Storage verilerini saklamak için kullanılan arayüz
interface LocalStorageData {
  [key: string]: string | number | object | null;
}

const LocalStorageViewer: React.FC = () => {
  const [localStorageData, setLocalStorageData] = useState<LocalStorageData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocalStorageData = () => {
      try {
        // Sadece yeni işaretlenmiş verileri çekmek için filtreleme
        const keys = Object.keys(localStorage);
        const data: LocalStorageData = {};

        keys.forEach((key) => {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const parsedItem = JSON.parse(item);
              // Verinin "isNew" işaretine göre kontrol yap
              if (parsedItem && typeof parsedItem === 'object' && parsedItem.isNew) {
                data[key] = parsedItem;
              }
            }
          } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
          }
        });

        setLocalStorageData(data);
      } catch (error) {
        console.error('Error fetching data from localStorage:', error);
        setError('An error occurred while fetching data from localStorage.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocalStorageData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container sx={{ textAlign: 'center' }}>
      <h2>New Local Storage Data</h2>
      {Object.keys(localStorageData).length === 0 ? (
        <p>No new data found in localStorage.</p>
      ) : (
        <ul>
          {Object.entries(localStorageData).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong>{' '}
              {typeof value === 'string' || typeof value === 'number'
                ? value
                : JSON.stringify(value, null, 2)}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default LocalStorageViewer;
