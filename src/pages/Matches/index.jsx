import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Activity, 
  Plus, 
  Search, 
  ChevronRight, 
  Calendar,
  Clock,
  ExternalLink,
  History
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const Matches = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "matches"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Live': return 'status-live';
      case 'Scheduled': return 'status-active';
      default: return '';
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Global Match Feed</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Real-time updates from all active leagues.</p>
        </div>
        <button className="shopify-btn-primary" onClick={() => navigate('/tournaments')}>
          <Play size={18} fill="white" /> New Match
        </button>
      </div>

      <div className="tab-scroller">
        {['All', 'Live', 'Upcoming', 'Completed'].map(tab => (
          <div 
            key={tab} 
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>Syncing global match data...</div>
        ) : matches.length === 0 ? (
          <div className="shopify-card" style={{ padding: '80px', textAlign: 'center' }}>
            <Activity size={64} color="#ddd" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 900 }}>No Matches Recorded</h2>
            <p style={{ color: '#999', margin: '12px 0 24px' }}>Once you schedule matches in a tournament, they will appear here.</p>
          </div>
        ) : (
          matches.map(m => (
            <div 
              key={m.id} 
              className={`shopify-card card-interactive`} 
              style={{ 
                padding: '28px', 
                marginBottom: 0,
                borderLeft: m.status === 'Live' ? '8px solid var(--color-live-red)' : '1px solid var(--color-border)'
              }}
              onClick={() => navigate(`/matches/${m.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span className={`status-badge ${getStatusStyle(m.status)}`}>
                        {m.status === 'Live' && <div className="live-dot" />}
                        {m.status}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#999' }}>ID: {m.id.substring(0,8).toUpperCase()}</span>
                   </div>
                   
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                         <div style={{ width: '50px', height: '50px', background: '#333', borderRadius: '16px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px', margin: '0 auto 12px' }}>
                            {m.teamAName?.charAt(0)}
                         </div>
                         <div style={{ fontWeight: 900, fontSize: '18px' }}>{m.teamAName}</div>
                      </div>

                      <div style={{ padding: '0 40px', textAlign: 'center' }}>
                         <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '2px' }}>
                            {m.runsA}/{m.wicketsA} <span style={{ color: 'var(--color-live-red)' }}>VS</span> {m.runsB}/{m.wicketsB}
                         </div>
                         <div style={{ fontSize: '12px', color: '#999', marginTop: '4px', fontWeight: 800 }}>
                            {m.oversA} OVERS • {m.oversB} OVERS
                         </div>
                      </div>

                      <div style={{ textAlign: 'center', flex: 1 }}>
                         <div style={{ width: '50px', height: '50px', background: 'var(--color-cricket-green)', borderRadius: '16px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px', margin: '0 auto 12px' }}>
                            {m.teamBName?.charAt(0)}
                         </div>
                         <div style={{ fontWeight: 900, fontSize: '18px' }}>{m.teamBName}</div>
                      </div>
                   </div>
                </div>

                <div style={{ width: '1px', height: '80px', background: '#f0f0f0', margin: '0 40px' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end', minWidth: '150px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#666' }}>
                      <Calendar size={14} /> {m.date}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#666' }}>
                      <Clock size={14} /> {m.time}
                   </div>
                   <button className="shopify-btn-secondary" style={{ padding: '8px 16px', marginTop: '8px', fontSize: '12px' }}>
                      View Match Center
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Matches;
