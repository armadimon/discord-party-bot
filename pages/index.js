import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/availability')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const timeSlots = ['18-20', '20-22', '22-00', 'full'];

  const getSlotUsers = (slot) => {
    return data.filter(d => d.time === slot || d.time === 'full');
  };

  if (loading) return <div style={styles.loading}>대시보드를 불러오는 중...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🎮 Game Party Dashboard</h1>
        <p style={styles.subtitle}>오늘의 파티 가능 인원 현황</p>
      </header>

      <div style={styles.grid}>
        {timeSlots.map(slot => (
          <div key={slot} style={styles.card}>
            <h2 style={styles.slotTitle}>{slot === 'full' ? '🔥 All Time' : `⏰ ${slot}`}</h2>
            <div style={styles.userCount}>{getSlotUsers(slot).length}명 참여 가능</div>
            <ul style={styles.userList}>
              {getSlotUsers(slot).map((u, i) => (
                <li key={i} style={styles.userItem}>👤 {u.username}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: '3rem' },
  title: { fontSize: '2.5rem', marginBottom: '0.5rem', color: '#38bdf8' },
  subtitle: { color: '#94a3b8' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155', transition: '0.3s' },
  slotTitle: { fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '2px solid #38bdf8', paddingBottom: '0.5rem' },
  userCount: { fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '1rem' },
  userList: { listStyle: 'none', padding: 0 },
  userItem: { marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' },
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: 'white' }
};

export default Dashboard;
