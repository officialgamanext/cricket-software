import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  TrendingUp, 
  Play, 
  ChevronRight,
  Activity,
  History
} from 'lucide-react';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [liveMatches, setLiveMatches] = useState([]);
  const [stats, setStats] = useState({ teams: 0, tournaments: 0, matches: 0 });

  useEffect(() => {
    // Live Matches Query
    const qLive = query(collection(db, "matches"), orderBy("createdAt", "desc"), limit(5));
    const unsubLive = onSnapshot(qLive, (snapshot) => {
      setLiveMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Stats Query
    const unsubTeams = onSnapshot(collection(db, "teams"), s => setStats(prev => ({ ...prev, teams: s.size })));
    const unsubTourn = onSnapshot(collection(db, "tournaments"), s => setStats(prev => ({ ...prev, tournaments: s.size })));

    return () => { unsubLive(); unsubTeams(); unsubTourn(); };
  }, []);

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Match Center</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Welcome back, Gama Dev! Here's what's happening today.</p>
        </div>
        <button className="shopify-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Play size={16} fill="white" /> New Match
        </button>
      </div>

      {/* MATCH SCROLLER */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--color-live-red)" /> Recent & Live Matches
          </h2>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-upcoming-blue)', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>View Schedule</button>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', scrollBehavior: 'smooth' }}>
          {liveMatches.map(match => (
            <div key={match.id} className="shopify-card" style={{ 
              minWidth: '340px', 
              padding: '24px', 
              marginBottom: 0,
              cursor: 'pointer',
              borderLeft: match.status === 'Live' ? '6px solid var(--color-live-red)' : '6px solid var(--color-upcoming-blue)'
            }} onClick={() => navigate(`/matches/${match.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#999' }}>LOCAL SERIES 2026</span>
                {match.status === 'Live' ? (
                  <span className="status-badge badge-live"><div className="live-dot" /> LIVE</span>
                ) : (
                  <span className="status-badge" style={{ background: '#eef', color: 'var(--color-upcoming-blue)' }}>{match.status}</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#333', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                      {match.teamAName?.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>{match.teamAName}</span>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 800 }}>{match.runsA}/{match.wicketsA} <small style={{ fontSize: '12px', color: '#999' }}>({match.oversA})</small></span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#008060', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                      {match.teamBName?.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>{match.teamBName}</span>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 800 }}>{match.runsB}/{match.wicketsB} <small style={{ fontSize: '12px', color: '#999' }}>({match.oversB})</small></span>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {match.status === 'Live' ? 'Mumbai Indians needs 42 runs in 18 balls' : `${match.date} • Local Stadium`}
              </div>
            </div>
          ))}
          {liveMatches.length === 0 && <div className="shopify-card" style={{ padding: '40px', minWidth: '340px', textAlign: 'center', color: '#999' }}>No matches recorded yet.</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* RECENT ACTIVITY */}
        <div className="shopify-card">
          <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} /> Tournament Rankings
            </h3>
            <button className="shopify-btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>View All</button>
          </div>
          <div style={{ padding: '0' }}>
            <table className="shopify-table">
               <thead>
                 <tr>
                    <th>Team</th>
                    <th>Played</th>
                    <th>Won</th>
                    <th>Points</th>
                    <th>NRR</th>
                 </tr>
               </thead>
               <tbody>
                  <tr style={{ cursor: 'pointer' }}>
                    <td><div style={{ fontWeight: 700 }}>Mumbai Indians</div></td>
                    <td>5</td>
                    <td>4</td>
                    <td><span style={{ fontWeight: 800 }}>8</span></td>
                    <td style={{ color: 'var(--color-cricket-green)', fontWeight: 700 }}>+1.420</td>
                  </tr>
                  <tr style={{ cursor: 'pointer' }}>
                    <td><div style={{ fontWeight: 700 }}>Chennai Super Kings</div></td>
                    <td>5</td>
                    <td>3</td>
                    <td><span style={{ fontWeight: 800 }}>6</span></td>
                    <td style={{ color: 'var(--color-cricket-green)', fontWeight: 700 }}>+0.850</td>
                  </tr>
               </tbody>
            </table>
          </div>
        </div>

        {/* QUICK STATS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="shopify-card" style={{ padding: '24px', background: 'var(--color-pitch-black)', color: 'white', marginBottom: 0 }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Total Tournaments</div>
            <div style={{ fontSize: '36px', fontWeight: 800 }}>{stats.tournaments}</div>
            <div style={{ marginTop: '12px', color: 'var(--color-cricket-green)', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={16} /> +2 this month
            </div>
          </div>
          
          <div className="shopify-card" style={{ padding: '24px', background: 'var(--color-cricket-green)', color: 'white', marginBottom: 0 }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Registered Teams</div>
            <div style={{ fontSize: '36px', fontWeight: 800 }}>{stats.teams}</div>
            <div style={{ marginTop: '12px', color: 'white', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={16} /> Fully Syncing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
