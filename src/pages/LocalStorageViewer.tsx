import React, { useEffect, useState } from 'react';

const LocalStorageViewer: React.FC = () => {
  const [data, setData] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage);
    const storageData = keys.map((key) => ({
      key,
      value: localStorage.getItem(key) || '',
    }));
    setData(storageData);
  }, []);

  return (
    <div>
      <h2>LocalStorage Data</h2>
      {data.length === 0 ? (
        <p>No data found in localStorage.</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.key}>
              <strong>{item.key}:</strong> {item.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocalStorageViewer;
