import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Calendar, 
  Trophy, 
  Clock, 
  X, 
  ChevronRight,
  UserCheck,
  MapPin,
  Medal,
  Activity,
  UserPlus,
  Play,
  Settings,
  MoreHorizontal,
  Target
} from 'lucide-react';
import { 
  doc, 
  onSnapshot, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../../firebase/config';

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [activeTab, setActiveTab] = useState('Matches');
  const [loading, setLoading] = useState(true);
  
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPlanItemModal, setShowPlanItemModal] = useState(false);

  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [planItemName, setPlanItemName] = useState('');
  const [planItemValue, setPlanItemValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const unsubTournament = onSnapshot(doc(db, "tournaments", id), (doc) => {
      if (doc.exists()) {
        setTournament({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });

    const qTeams = query(collection(db, "teams"), where("tournamentId", "==", id));
    const unsubTeams = onSnapshot(qTeams, (snapshot) => {
      setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qMatches = query(collection(db, "matches"), where("tournamentId", "==", id));
    const unsubMatches = onSnapshot(qMatches, (snapshot) => {
      setMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubAllTeams = onSnapshot(collection(db, "teams"), (snapshot) => {
      setAvailableTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubTournament(); unsubTeams(); unsubMatches(); unsubAllTeams(); };
  }, [id]);

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!selectedTeamId) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "teams", selectedTeamId), {
        tournamentId: id,
        matchesPlayed: 0,
        won: 0,
        lost: 0,
        points: 0
      });
      await updateDoc(doc(db, "tournaments", id), { teams: increment(1) });
      setSelectedTeamId('');
      setShowTeamModal(false);
    } catch (err) { console.error(err); } finally { setIsSaving(false); }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!teamA || !teamB || teamA === teamB) return;
    setIsSaving(true);
    try {
      const matchData = {
        tournamentId: id,
        teamAId: teamA,
        teamBId: teamB,
        teamAName: teams.find(t => t.id === teamA)?.name || 'Team A',
        teamBName: teams.find(t => t.id === teamB)?.name || 'Team B',
        date: matchDate, matchTime: matchTime,
        status: 'Scheduled',
        runsA: 0, wicketsA: 0, oversA: 0,
        runsB: 0, wicketsB: 0, oversB: 0,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, "matches"), matchData);
      await updateDoc(doc(db, "tournaments", id), { matches: increment(1) });
      setShowScheduleModal(false);
    } catch (err) { console.error(err); } finally { setIsSaving(false); }
  };

  if (loading) return <div className="main-content">Syncing Series Center...</div>;
  if (!tournament) return <div className="main-content">Series not found.</div>;

  return (
    <div className="main-content">
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div className="header-flex">
          <div style={{ width: '80px', height: '80px', background: 'var(--color-cricket-green)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,168,107,0.3)', flexShrink: 0 }}>
            <Trophy size={40} color="white" />
          </div>
          <div style={{ minWidth: 0 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h1 className="page-title" style={{ fontSize: '28px', margin: 0 }}>{tournament.name}</h1>
                <span className="status-badge status-active">{tournament.status}</span>
             </div>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: '8px', color: '#666', fontSize: '13px', fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> MAIN CIRCUIT</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> FEB 2026</span>
             </div>
          </div>
        </div>
        <button className="shopify-btn-secondary" onClick={() => navigate('/tournaments')}><ArrowLeft size={18} /> <span className="hide-mobile">Back</span></button>
      </div>

      <div className="tab-scroller" style={{ marginBottom: '32px' }}>
        {['Matches', 'Teams', 'Schedule', 'Plan'].map(tab => (
          <div key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.toUpperCase()}
          </div>
        ))}
      </div>

      <div className="shopify-card" style={{ padding: 'min(40px, 5vw)', border: 'none', background: 'white' }}>
        {/* MATCHES */}
        {activeTab === 'Matches' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900 }}>Global Match Feed</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                 <button className="shopify-btn-secondary" style={{ padding: '8px' }}><Settings size={18} /></button>
              </div>
            </div>
            <div className="card-grid">
              {matches.map(m => (
                <div key={m.id} className="shopify-card card-interactive" style={{ padding: '0', marginBottom: 0 }} onClick={() => navigate(`/matches/${m.id}`)}>
                   <div style={{ padding: '16px 20px', background: m.status === 'Live' ? 'var(--color-live-red)' : '#f8f9fa', color: m.status === 'Live' ? 'white' : 'inherit' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontSize: '10px', fontWeight: 900, opacity: 0.8 }}>ID: {m.id.substring(0,8).toUpperCase()}</span>
                         <span className={`status-badge ${m.status === 'Live' ? 'status-live' : ''}`} style={{ border: 'none', padding: '4px 10px', fontSize: '10px' }}>
                            {m.status === 'Live' && <div className="live-dot" />} {m.status}
                         </span>
                      </div>
                   </div>
                   <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                         <div style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{ fontSize: '16px', fontWeight: 900 }}>{m.teamAName}</div>
                            <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '4px', color: 'var(--color-cricket-green)' }}>{m.runsA}/{m.wicketsA}</div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#999' }}>{m.oversA} OVERS</div>
                         </div>
                         <div style={{ padding: '0 8px', fontSize: '12px', fontWeight: 900, color: '#ddd' }}>VS</div>
                         <div style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{ fontSize: '16px', fontWeight: 900 }}>{m.teamBName}</div>
                            <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '4px', color: 'var(--color-cricket-green)' }}>{m.runsB}/{m.wicketsB}</div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#999' }}>{m.oversB} OVERS</div>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEAMS */}
        {activeTab === 'Teams' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900 }}>Series Participants</h2>
              <button className="shopify-btn-primary" onClick={() => setShowTeamModal(true)}><UserPlus size={18} /> Tag Team</button>
            </div>
            <div className="card-grid">
              {teams.map(t => (
                <div key={t.id} className="shopify-card card-interactive" style={{ padding: '20px', textAlign: 'center', marginBottom: 0 }}>
                   <div style={{ width: '56px', height: '56px', background: '#f8f9fa', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <Users size={28} color="var(--color-cricket-green)" />
                   </div>
                   <div style={{ fontWeight: 900, fontSize: '16px' }}>{t.name}</div>
                   <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1.5px solid #f0f0f0' }}>
                      <div>
                        <div style={{ fontWeight: 900 }}>{t.points || 0}</div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#999' }}>POINTS</div>
                      </div>
                      <div style={{ width: '1px', background: '#f0f0f0' }} />
                      <div>
                        <div style={{ fontWeight: 900 }}>{t.players?.length || 0}</div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#999' }}>SQUAD</div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        {activeTab === 'Schedule' && (
           <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 900 }}>Battle Plan</h2>
                <button className="shopify-btn-primary" onClick={() => setShowScheduleModal(true)}><Calendar size={18} /> Add Schedule</button>
              </div>
              <div style={{ border: '2px solid #f0f0f0', borderRadius: '24px', overflow: 'hidden' }}>
                 <table className="shopify-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Matchup</th>
                        <th>Venue</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches.filter(m => m.status === 'Scheduled').map(m => (
                        <tr key={m.id}>
                           <td>
                              <div style={{ fontWeight: 900, fontSize: '16px' }}>{m.date}</div>
                              <div style={{ fontSize: '12px', color: '#999', fontWeight: 700 }}>{m.matchTime || 'TBD'}</div>
                           </td>
                           <td style={{ fontSize: '18px', fontWeight: 900 }}>
                              {m.teamAName} <span style={{ color: 'var(--color-live-red)', margin: '0 8px' }}>VS</span> {m.teamBName}
                           </td>
                           <td style={{ fontWeight: 700, color: '#666' }}>Main Arena</td>
                           <td><span className="status-badge" style={{ background: '#fff0d1', color: '#8a6116' }}>Upcoming</span></td>
                           <td><button className="shopify-btn-primary" onClick={() => navigate(`/scoring/${m.id}`)}>Scoring</button></td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </div>

      {/* MODALS */}
      {showTeamModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>INVITE SQUAD</h2>
              <button className="shopify-btn-secondary" style={{ padding: '8px', border: 'none' }} onClick={() => setShowTeamModal(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleAddTeam}>
               <div className="modal-body-scroll">
                  <div className="form-group">
                    <label className="form-label">Available Master Registry Teams</label>
                    <select className="form-input" value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)} required>
                      <option value="">-- Choose a team --</option>
                      {availableTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
               </div>
               <div className="modal-footer">
                  <button type="button" className="shopify-btn-secondary" onClick={() => setShowTeamModal(false)}>Cancel</button>
                  <button type="submit" className="shopify-btn-primary" disabled={isSaving}>Tag to Series</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentDetails;
