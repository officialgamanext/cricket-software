import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ChevronRight, 
  Clock, 
  Disc, 
  Play, 
  Users,
  Layout,
  Wifi,
  Zap,
  RotateCcw,
  CheckCircle,
  MoreHorizontal
} from 'lucide-react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const Scoring = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('Console');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "matches", id), (doc) => {
      if (doc.exists()) {
        setMatch({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) return <div className="main-content">Syncing with Match Center...</div>;
  if (!match) return <div className="main-content">Match session not found.</div>;

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="status-badge status-live">Live</span> 
            {match.teamAName} vs {match.teamBName}
          </h1>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', color: '#666', fontSize: '13px', fontWeight: 700 }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Wifi size={14} color="var(--color-cricket-green)" /> LIVE SYNC ACTIVE</span>
             <span>SERIES: LOCAL SEASON 2026</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="shopify-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <RotateCcw size={16} /> Undo
          </button>
          <button className="shopify-btn-primary" style={{ background: 'var(--color-pitch-black)', boxShadow: '0 4px 0 #000' }}>
             <CheckCircle size={16} /> Finish Match
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* MAIN SCOREBOARD */}
          <div className="shopify-card" style={{ padding: '0', background: 'var(--color-pitch-black)', color: 'white' }}>
             <div style={{ padding: '40px', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
                   <div style={{ fontSize: '12px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>CURRENT INNINGS</div>
                   <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-cricket-green)' }}>{match.teamAName?.toUpperCase()}</div>
                </div>

                <div style={{ fontSize: '120px', fontWeight: 900, lineHeight: 1, letterSpacing: '-5px' }}>
                  {match.runsA}<span style={{ color: 'var(--color-live-red)' }}>/</span>{match.wicketsA}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  OVERS: {match.oversA} <span style={{ margin: '0 12px', opacity: 0.3 }}>|</span> CRR: {(match.runsA / (match.oversA || 1)).toFixed(2)}
                </div>
             </div>

             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px 40px', display: 'flex', justifyContent: 'center', gap: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                   <div style={{ width: '48px', height: '48px', background: 'var(--color-cricket-green)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>*</div>
                   <div>
                      <div style={{ fontSize: '20px', fontWeight: 900 }}>V. Kohli</div>
                      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>42 (28) • 4x4, 2x6</div>
                   </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', opacity: 0.6 }}>
                   <div style={{ width: '48px', height: '48px', background: '#333', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}></div>
                   <div>
                      <div style={{ fontSize: '20px', fontWeight: 900 }}>KL Rahul</div>
                      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>18 (15) • 1x4, 0x6</div>
                   </div>
                </div>
             </div>
          </div>

          {/* SCORING PAD */}
          <div className="shopify-card" style={{ padding: '32px' }}>
             <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#999', marginBottom: '24px', letterSpacing: '1px' }}>SCORING PAD</h3>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
                {[0, 1, 2, 3, 4, 6].map(run => (
                   <button 
                     key={run} 
                     className="shopify-btn-secondary" 
                     style={{ height: '80px', fontSize: '24px', fontWeight: 900, borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}
                   >
                     {run}
                     <span style={{ fontSize: '10px', opacity: 0.5 }}>RUNS</span>
                   </button>
                ))}
                
                <button className="shopify-btn-primary" style={{ height: '80px', gridColumn: 'span 2', borderRadius: '20px', background: 'var(--color-live-red)', boxShadow: '0 6px 0 #b00' }}>
                   <Zap size={20} /> WICKET
                </button>
                <button className="shopify-btn-secondary" style={{ height: '80px', gridColumn: 'span 2', borderRadius: '20px', borderColor: 'var(--color-cricket-green)', color: 'var(--color-cricket-green)' }}>
                   EXTRAS / NB / WD
                </button>
                <button className="shopify-btn-secondary" style={{ height: '80px', gridColumn: 'span 2', borderRadius: '20px' }}>
                   OVER COMPLETE
                </button>
             </div>
          </div>
        </div>

        {/* SIDEBAR TOOLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="shopify-card">
              <div style={{ padding: '20px', borderBottom: '1.5px solid #f0f0f0', fontWeight: 900, fontSize: '13px' }}>CURRENT BOWLER</div>
              <div style={{ padding: '24px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ width: '48px', height: '48px', background: '#333', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Disc size={24} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 800 }}>Jasprit Bumrah</div>
                       <div style={{ fontSize: '12px', color: '#999', fontWeight: 700 }}>6.2 - 0 - 42 - 1</div>
                    </div>
                 </div>
                 
                 <div style={{ fontSize: '11px', fontWeight: 900, color: '#999', marginBottom: '12px' }}>THIS OVER</div>
                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['1', '0', '4', 'wd', '0', 'W'].map((b, i) => (
                       <div key={i} style={{ width: '36px', height: '36px', borderRadius: '12px', background: b === 'W' ? 'var(--color-live-red)' : (b === '4' ? 'var(--color-cricket-green)' : '#f0f2f5'), color: (b === 'W' || b === '4') ? 'white' : 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900 }}>
                          {b}
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="shopify-card" style={{ background: 'var(--color-cricket-green)', color: 'white', padding: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, opacity: 0.8, marginBottom: '8px' }}>PARTNERSHIP</div>
              <div style={{ fontSize: '28px', fontWeight: 900 }}>64 <small style={{ fontSize: '14px', opacity: 0.6 }}>(42 balls)</small></div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', margin: '16px 0' }}>
                 <div style={{ width: '60%', height: '100%', background: 'white', borderRadius: '2px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
                 <span>KOHLI (42)</span>
                 <span>RAHUL (18)</span>
              </div>
           </div>

           <button className="shopify-btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
              <Layout size={18} /> Detailed Stats Page
           </button>
        </div>
      </div>
    </div>
  );
};

export default Scoring;
