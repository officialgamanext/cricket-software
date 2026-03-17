import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Activity, 
  Plus, 
  ChevronRight, 
  Calendar,
  Clock,
  Target,
  ArrowRight
} from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const Matches = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We remove the Firestore orderBy to avoid "Index Missing" errors that can break the UI
    const q = query(collection(db, "matches"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const matchData = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        // Sort in memory instead: latest first
        matchData.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setMatches(matchData);
        setLoading(false);
      } catch (err) {
        console.error("Data processing error:", err);
        setLoading(false);
      }
    }, (error) => {
      console.error("Firestore subscription error:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const filteredMatches = matches.filter(m => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Live') return m.status === 'Live';
    if (activeTab === 'Upcoming') return m.status === 'Scheduled';
    if (activeTab === 'Completed') return m.status === 'Completed';
    return true;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Live': return <span className="status-badge status-live"><div className="live-dot" /> LIVE</span>;
      case 'Scheduled': return <span className="status-badge" style={{ background: '#eef', color: '#1a73e8', border: '1px solid #d0e0ff' }}>UPCOMING</span>;
      case 'Completed': return <span className="status-badge" style={{ background: '#f4f4f4', color: '#666' }}>FINISHED</span>;
      default: return <span className="status-badge">{status || 'PENDING'}</span>;
    }
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return { month: 'TBD', day: '--' };
    try {
      const parts = dateStr.split('-');
      if (parts.length < 3) return { month: 'JAN', day: parts[0] || '?' };
      // Common format: YYYY-MM-DD
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthIdx = parseInt(parts[1]) - 1;
      return {
        month: months[monthIdx] || 'MAR',
        day: parts[2]
      };
    } catch {
      return { month: 'MAR', day: '?' };
    }
  };

  return (
    <div className="main-content">
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Series Fixtures</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px', fontSize: '14px' }}>Real-time match feed & scheduling.</p>
          </div>
          <button className="shopify-btn-primary" onClick={() => navigate('/tournaments')} style={{ background: 'var(--color-pitch-black)', boxShadow: '0 4px 0 #000' }}>
            <Plus size={18} /> New Schedule
          </button>
        </div>

        <div className="tab-scroller" style={{ marginBottom: '24px' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>
               <Activity size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
               <div style={{ fontWeight: 700 }}>Initializing Feed...</div>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="shopify-card" style={{ padding: '80px', textAlign: 'center', borderStyle: 'dashed', background: 'transparent' }}>
              <Target size={48} color="#ccc" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>No Matches Enlisted</h2>
              <p style={{ color: '#999', marginTop: '8px' }}>Create your first match in the Tournaments section.</p>
            </div>
          ) : (
            filteredMatches.map(m => {
              const dateInfo = formatDateLabel(m.date);
              return (
                <div 
                  key={m.id} 
                  className="shopify-card card-interactive" 
                  style={{ 
                    padding: '0', 
                    marginBottom: 0,
                    cursor: 'pointer',
                    borderLeft: m.status === 'Live' ? '8px solid var(--color-live-red)' : '1px solid var(--color-border)'
                  }}
                  onClick={() => navigate(`/matches/${m.id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'stretch' }}>
                  {/* Date Pane */}
                  <div style={{ padding: '16px', width: '110px', background: '#fafafa', borderRight: '1.5px solid #f0f0f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                     <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-cricket-green)', letterSpacing: '1px' }}>{dateInfo.month}</div>
                     <div style={{ fontSize: '24px', fontWeight: 900, lineHeight: 1, margin: '2px 0' }}>{dateInfo.day}</div>
                     <div style={{ fontSize: '11px', fontWeight: 700, color: '#999' }}>{m.matchTime || m.time || 'TBD'}</div>
                  </div>

                  {/* Score Pane */}
                  <div style={{ flex: 1, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: 0 }}>
                      <div style={{ textAlign: 'right', flex: 1, minWidth: 0 }}>
                         <div style={{ fontWeight: 900, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.teamAName || 'Team A'}</div>
                         <div style={{ fontSize: '19px', fontWeight: 900, color: '#111', marginTop: '2px' }}>
                           {m.runsA || 0}/{m.wicketsA || 0}
                         </div>
                      </div>

                      <div style={{ color: '#ddd', fontWeight: 900, fontSize: '12px', flexShrink: 0, padding: '0 10px' }}>VS</div>

                      <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                         <div style={{ fontWeight: 900, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.teamBName || 'Team B'}</div>
                         <div style={{ fontSize: '19px', fontWeight: 900, color: '#111', marginTop: '2px' }}>
                           {m.runsB || 0}/{m.wicketsB || 0}
                         </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '24px', flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                         {getStatusBadge(m.status)}
                      </div>
                      <ArrowRight size={18} color="#ddd" />
                    </div>
                  </div>
                </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Matches;
