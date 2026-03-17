import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Calendar,
  ChevronRight,
  Play
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="main-content">Loading match details...</div>;
  if (!match) return <div className="main-content">Match not found.</div>;

  return (
    <div className="main-content">
      <div style={{ marginBottom: '24px' }}>
        <button 
          className="shopify-btn-secondary" 
          onClick={() => navigate(-1)}
          style={{ padding: '4px 8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="page-header">
        <h1 className="page-title">Match Center</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="shopify-btn-primary"
            onClick={() => navigate(`/scoring/${match.id}`)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Play size={16} fill="white" /> Start/Resume Scoring
          </button>
        </div>
      </div>

      <div className="shopify-card" style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>
            {match.date} • {match.venue || 'Local Grounds'}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '60px' }}>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>{match.teamAName}</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '8px' }}>
                {match.runsA}/{match.wicketsA} <span style={{ fontSize: '18px', color: '#999' }}>({match.oversA})</span>
              </div>
            </div>
            
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#999', padding: '10px 20px', background: '#f4f4f4', borderRadius: '8px' }}>VS</div>
            
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>{match.teamBName}</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '8px' }}>
                {match.runsB}/{match.wicketsB} <span style={{ fontSize: '18px', color: '#999' }}>({match.oversB})</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px', color: 'var(--color-status-success-text)', fontWeight: 700, fontSize: '18px' }}>
            {match.status === 'Scheduled' ? 'Match scheduled to start' : (match.status === 'Live' ? 'Match is currently LIVE' : 'Match Completed')}
          </div>
        </div>

        <div className="tab-scroller">
          <div className="tab-item active">Summary</div>
          <div className="tab-item">Scorecard</div>
          <div className="tab-item">Commentary</div>
          <div className="tab-item">Highlights</div>
        </div>
        
        <div style={{ padding: '32px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Top Performers (Batting)</h4>
                <div style={{ color: '#999', fontSize: '14px' }}>Statistics will appear once match starts.</div>
              </div>
              <div>
                <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Top Performers (Bowling)</h4>
                <div style={{ color: '#999', fontSize: '14px' }}>Statistics will appear once match starts.</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
