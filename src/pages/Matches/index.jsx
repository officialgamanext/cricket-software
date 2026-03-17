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
  History,
  Target
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
        <button className="shopify-btn-primary" onClick={() => navigate('/tournaments')} style={{ background: 'var(--color-pitch-black)', boxShadow: '0 4px 0 #000' }}>
          <Play size={18} fill="white" /> Schedule New Match
        </button>
      </div>

      <div className="tab-scroller">
        {['All', 'Live', 'Upcoming', 'Completed'].map(tab => (
          <div 
            key={tab} 
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
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
              className="shopify-card card-interactive" 
              style={{ 
                padding: '0', 
                marginBottom: 0,
                cursor: 'pointer',
                borderLeft: m.status === 'Live' ? '12px solid var(--color-live-red)' : '1px solid var(--color-border)'
              }}
              onClick={() => navigate(`/matches/${m.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                {/* Status Column */}
                <div style={{ padding: '24px', background: '#fafafa', borderRight: '1.5px solid #f0f0f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minWidth: '130px' }}>
                   <span className={`status-badge ${getStatusStyle(m.status)}`} style={{ marginBottom: '12px' }}>
                      {m.status === 'Live' && <div className="live-dot" />}
                      {m.status}
                   </span>
                   <div style={{ fontSize: '11px', fontWeight: 900, color: '#bbb' }}>ID: {m.id.substring(0,6).toUpperCase()}</div>
                </div>

                {/* Main Scoreboard Area */}
                <div style={{ flex: 1, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                      <div style={{ textAlign: 'right', flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: '18px' }}>{m.teamAName}</div>
                        <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-cricket-green)', marginTop: '4px' }}>
                          {m.runsA}/{m.wicketsA} <small style={{ fontSize: '12px', color: '#999' }}>({m.oversA})</small>
                        </div>
                      </div>
                      
                      <div style={{ background: '#f4f4f4', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#999', fontSize: '12px' }}>
                         VS
                      </div>

                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: '18px' }}>{m.teamBName}</div>
                        <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-cricket-green)', marginTop: '4px' }}>
                          {m.runsB}/{m.wicketsB} <small style={{ fontSize: '12px', color: '#999' }}>({m.oversB})</small>
                        </div>
                      </div>
                   </div>

                   <div style={{ width: '1.5px', height: '60px', background: '#f0f0f0', margin: '0 40px' }} />

                   <div style={{ textAlign: 'right', minWidth: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', fontSize: '13px', fontWeight: 800, color: '#666' }}>
                         <Calendar size={14} /> {m.date}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', fontSize: '13px', fontWeight: 800, color: '#666', marginTop: '4px' }}>
                         <Clock size={14} /> {m.time || '18:00'}
                      </div>
                      <div style={{ marginTop: '12px' }}>
                         <button className="shopify-btn-secondary" style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            View Details <ChevronRight size={14} />
                         </button>
                      </div>
                   </div>
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
