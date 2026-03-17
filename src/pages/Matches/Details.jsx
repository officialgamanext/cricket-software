import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Calendar,
  ChevronRight,
  Play,
  Share2,
  Trophy,
  Activity,
  Target
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "matches", id), (doc) => {
      if (doc.exists()) {
        setMatch({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  if (loading) return <div className="main-content">Syncing Match Center...</div>;
  if (!match) return <div className="main-content">Match session not found.</div>;

  return (
    <div className="main-content">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          className="shopify-btn-secondary" 
          onClick={() => navigate('/matches')}
          style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Back to Global Feed
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button className="shopify-btn-secondary" style={{ padding: '8px' }}><Share2 size={16} /></button>
           <button 
             className="shopify-btn-primary"
             onClick={() => navigate(`/scoring/${match.id}`)}
             style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-pitch-black)', boxShadow: '0 4px 0 #000' }}
           >
             <Play size={16} fill="white" /> Open Controls
           </button>
        </div>
      </div>

      <div className="shopify-card" style={{ padding: '0', background: 'var(--color-pitch-black)', color: 'white', border: 'none', marginBottom: '32px' }}>
        <div style={{ padding: '60px 40px', position: 'relative', textAlign: 'center' }}>
           <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
              <span className={`status-badge ${match.status === 'Live' ? 'status-live' : ''}`} style={{ border: 'none' }}>
                 {match.status === 'Live' && <div className="live-dot" />} {match.status.toUpperCase()}
              </span>
           </div>

           <div className="scoreboard-container">
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: '8px' }}>TEAM A</div>
                <div style={{ fontSize: '24px', fontWeight: 900 }}>{match.teamAName}</div>
                <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--color-cricket-green)', marginTop: '8px' }}>
                   {match.runsA}/{match.wicketsA}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, opacity: 0.6 }}>{match.oversA} OVERS</div>
              </div>
              
              <div className="vs-marker" style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'rgba(255,255,255,0.3)', fontSize: '18px', flexShrink: 0 }}>VS</div>
              
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: '8px' }}>TEAM B</div>
                <div style={{ fontSize: '24px', fontWeight: 900 }}>{match.teamBName}</div>
                <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--color-cricket-green)', marginTop: '8px' }}>
                   {match.runsB}/{match.wicketsB}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, opacity: 0.6 }}>{match.oversB} OVERS</div>
              </div>
           </div>

           <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '24px', color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> {match.date}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> {match.venue || 'Local Stadium'}</div>
           </div>
        </div>
      </div>

      <div className="tab-scroller">
        {['Overview', 'Scorecard', 'Commentary', 'Squads'].map(tab => (
          <div 
            key={tab} 
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </div>
        ))}
      </div>
      
      <div className="responsive-split" style={{ animation: 'fadeIn 0.5s ease-out' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="shopify-card" style={{ padding: '32px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={20} color="var(--color-cricket-green)" /> MATCH SYNOPSIS
               </h3>
               <div style={{ lineHeight: '1.6', color: '#666', fontWeight: 500 }}>
                  This match is part of the professional regional circuit. {match.status === 'Live' ? 'The game is currently active and scores are being synced in real-time.' : (match.status === 'Scheduled' ? 'The match is currently scheduled and yet to start.' : 'The match has concluded.')} 
               </div>
               
               <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '16px' }}>
                     <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#999', marginBottom: '16px' }}>BATTING LEADERS</h4>
                     <div style={{ color: '#bbb', fontSize: '13px', fontWeight: 600 }}>No data recorded for this session yet.</div>
                  </div>
                  <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '16px' }}>
                     <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#999', marginBottom: '16px' }}>BOWLING LEADERS</h4>
                     <div style={{ color: '#bbb', fontSize: '13px', fontWeight: 600 }}>No data recorded for this session yet.</div>
                  </div>
               </div>
            </div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="shopify-card" style={{ padding: '24px', background: 'var(--color-cricket-green)', color: 'white' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Trophy size={24} />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900 }}>SERIES CONTEXT</h3>
               </div>
               <div style={{ fontSize: '14px', fontWeight: 700, opacity: 0.9 }}>
                  Winner of this match will advance by 2 points in the group standings.
               </div>
               <button className="shopify-btn-secondary" style={{ width: '100%', marginTop: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontWeight: 800 }}>
                  View Standings
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MatchDetails;
