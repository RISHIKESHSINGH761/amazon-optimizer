import { useEffect, useState } from 'react';
import { fetchHistory } from '../services/api';

export default function History({ asin }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!asin) return;
    fetchHistory(asin).then(r => setItems(r.data));
  }, [asin]);

  return (
    <div>
      <h3>History for {asin}</h3>
      {items.map(it => (
        <div key={it.id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <div><strong>{it.optimized_title}</strong></div>
          <div>{new Date(it.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
