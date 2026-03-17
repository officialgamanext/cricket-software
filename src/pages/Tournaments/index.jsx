import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Plus, 
  Search, 
  Activity, 
  ChevronRight,
  MoreVertical,
  Layers,
  MapPin,
  Clock,
  X 
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const Tournaments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Active');
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // New Tournament Form
  const [tournamentName, setTournamentName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "tournaments"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tourns = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTournaments(tourns);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    if (!tournamentName.trim()) return;

    setIsSaving(true);
    try {
      await addDoc(collection(db, "tournaments"), {
        name: tournamentName,
        status: 'Active',
        createdAt: serverTimestamp(),
        teams: 0,
        matches: 0,
        prizePool: '₹50,000'
      });
      setTournamentName('');
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Series & Championships</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Launch and manage your major cricket series.</p>
        </div>
        <button className="shopify-btn-primary" onClick={() => setShowModal(true)}>
          <Trophy size={18} /> New Series
        </button>
      </div>

      <div className="tab-scroller">
        {['All', 'Active', 'Completed', 'Upcoming'].map(tab => (
          <div 
            key={tab} 
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="card-grid">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', gridColumn: '1/-1' }}>Loading series list...</div>
        ) : tournaments.length === 0 ? (
          <div className="shopify-card" style={{ padding: '80px', textAlign: 'center', gridColumn: '1/-1' }}>
            <Activity size={64} color="#ddd" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 900 }}>No Active Series</h2>
            <p style={{ color: '#999', margin: '12px 0 24px' }}>Ready to start a tournament? Click the button above.</p>
          </div>
        ) : tournaments.map(t => (
          <div key={t.id} className="shopify-card card-interactive" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '28px', borderBottom: '1.5px solid #f0f0f0', background: 'white' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--color-cricket-green)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Trophy size={24} color="white" />
                  </div>
                  <span className="status-badge status-active">{t.status}</span>
               </div>
               <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px' }}>{t.name}</h3>
               <div style={{ display: 'flex', gap: '16px', color: '#666', fontSize: '12px', fontWeight: 700 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> MAIN STADIUM</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> SERIES ID: {t.id.substring(0,6).toUpperCase()}</span>
               </div>
            </div>

            <div style={{ padding: '24px', background: '#fafbfc' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 900 }}>{t.teams || 0}</div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Teams</div>
                  </div>
                  <div style={{ width: '1px', background: '#e0e0e0', margin: '0 auto' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 900 }}>{t.matches || 0}</div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Matches</div>
                  </div>
               </div>
            </div>

            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'center' }}>
               <button 
                  className="shopify-btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }} 
                  onClick={() => navigate(`/tournaments/${t.id}`)}
               >
                  Go to Series Center <ChevronRight size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>ENLIST SERIES</h2>
              <button className="shopify-btn-secondary" style={{ padding: '8px', border: 'none' }} onClick={() => setShowModal(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleCreateTournament}>
              <div className="modal-body-scroll">
                <div className="form-group">
                  <label className="form-label">Series Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Summer Championship 2026"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    required 
                    autoFocus
                  />
                  <p style={{ marginTop: '12px', fontSize: '12px', color: '#999', lineHeight: '1.5' }}>
                    Once created, you can add teams, schedule matches, and manage scoring in the Series Center.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="shopify-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="shopify-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Processing...' : 'Launch Series'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournaments;
