import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ListFilter, 
  ArrowUpDown, 
  Plus, 
  X, 
  UserPlus, 
  Trash2, 
  Users,
  Edit2,
  Eye,
  Shield,
  MapPin,
  Trophy
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase/config';

const Teams = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState({ name: '', type: 'Batsman', role: 'None' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "teams"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeams(teamList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setTeamName('');
    setPlayers([]);
    setEditingId(null);
    setIsViewMode(false);
  };

  const addPlayerToList = () => {
    if (!currentPlayer.name.trim()) return;
    setPlayers([...players, { ...currentPlayer, id: Date.now() }]);
    setCurrentPlayer({ name: '', type: 'Batsman', role: 'None' });
  };

  const removePlayerFromList = (id) => {
    if (isViewMode) return;
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleCreateNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditTeam = (team) => {
    setEditingId(team.id);
    setTeamName(team.name);
    setPlayers(team.players || []);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleViewTeam = (team) => {
    setEditingId(team.id);
    setTeamName(team.name);
    setPlayers(team.players || []);
    setIsViewMode(true);
    setShowModal(true);
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm("Delete this team and all its players?")) {
      try {
        await deleteDoc(doc(db, "teams", id));
      } catch (err) { console.error(err); }
    }
  };

  const handleSaveTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim() || players.length === 0) {
      alert("Enter team name and squad members.");
      return;
    }

    setIsSaving(true);
    try {
      const teamData = {
        name: teamName,
        players: players,
        updatedAt: serverTimestamp(),
        status: 'Active',
      };

      if (editingId) {
        await updateDoc(doc(db, "teams", editingId), teamData);
      } else {
        await addDoc(collection(db, "teams"), {
          ...teamData,
          createdAt: serverTimestamp(),
          city: 'Regional'
        });
      }
      resetForm();
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
          <h1 className="page-title">Team Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Build and manage your professional squads.</p>
        </div>
        <button className="shopify-btn-primary" onClick={handleCreateNew}>
          <Plus size={18} /> Create New Team
        </button>
      </div>

      <div className="tab-scroller">
        {['All', 'A-League', 'B-League', 'Draft'].map(tab => (
          <div 
            key={tab} 
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', gridColumn: '1/-1' }}>Loading professional squads...</div>
        ) : teams.length === 0 ? (
          <div className="shopify-card" style={{ padding: '80px', textAlign: 'center', gridColumn: '1/-1' }}>
            <Shield size={64} color="#ddd" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 900 }}>No Teams Found</h2>
            <p style={{ color: '#999', margin: '12px 0 24px' }}>Start by building your first championship-ready team.</p>
            <button className="shopify-btn-primary" onClick={handleCreateNew}>Add Team</button>
          </div>
        ) : teams.map(team => (
          <div key={team.id} className="shopify-card card-interactive" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '100px', background: 'var(--color-pitch-black)', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'var(--color-cricket-green)', opacity: 0.1, borderRadius: '50%' }} />
               <div style={{ padding: '24px', position: 'relative', zIndex: 1 }}>
                  <span className="status-badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>{team.status}</span>
                  <h3 style={{ color: 'white', marginTop: '8px', fontSize: '20px', fontWeight: 900 }}>{team.name}</h3>
               </div>
            </div>
            
            <div style={{ padding: '24px', flex: 1 }}>
               <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-cricket-green)' }}>{team.players?.length || 0}</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Squad Size</div>
                  </div>
                  <div style={{ width: '1px', background: '#eee' }} />
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 900 }}>0</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Titles</div>
                  </div>
               </div>

               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '13px' }}>
                  <MapPin size={14} /> Regional Circuit • {team.city || 'Local'}
               </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', background: '#fafafa' }}>
               <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="shopify-btn-secondary" style={{ padding: '8px' }} onClick={() => handleViewTeam(team)}><Eye size={16} /></button>
                  <button className="shopify-btn-secondary" style={{ padding: '8px' }} onClick={() => handleEditTeam(team)}><Edit2 size={16} /></button>
               </div>
               <button className="shopify-btn-secondary" style={{ padding: '8px', border: 'none', color: '#ff4d4d' }} onClick={() => handleDeleteTeam(team.id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-full">
            <div className="modal-header">
              <h2>{isViewMode ? 'SQUAD DETAILS' : (editingId ? 'UPDATE SQUAD' : 'ENLIST NEW TEAM')}</h2>
              <button className="shopify-btn-secondary" style={{ padding: '8px', border: 'none' }} onClick={() => { setShowModal(false); resetForm(); }}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <div className="form-group">
                <label className="form-label">Championship Team Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Royal Challengers"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  disabled={isViewMode}
                  style={{ fontSize: '20px' }}
                />
              </div>

              <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} color="var(--color-cricket-green)" /> SQUAD BUILDER
                </h3>
                
                {!isViewMode && (
                  <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '20px', border: '2px solid #edeff0', marginBottom: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 120px', gap: '16px' }}>
                      <div>
                        <label className="form-label">Player Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={currentPlayer.name}
                          onChange={(e) => setCurrentPlayer({...currentPlayer, name: e.target.value})}
                          onKeyPress={(e) => e.key === 'Enter' && addPlayerToList()}
                        />
                      </div>
                      <div>
                        <label className="form-label">Class</label>
                        <select className="form-input" value={currentPlayer.type} onChange={e => setCurrentPlayer({...currentPlayer, type: e.target.value})}>
                          <option value="Batsman">Batsman</option>
                          <option value="Bowler">Bowler</option>
                          <option value="All-rounder">All-rounder</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Honors</label>
                        <select className="form-input" value={currentPlayer.role} onChange={e => setCurrentPlayer({...currentPlayer, role: e.target.value})}>
                          <option value="None">Member</option>
                          <option value="Captain">Captain</option>
                          <option value="Vice Captain">V. Captain</option>
                          <option value="Wicket Keeper">WK</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="button" className="shopify-btn-primary" style={{ width: '100%', height: '50px', justifyContent: 'center' }} onClick={addPlayerToList}>
                          Enlist
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {players.map((p) => (
                    <div key={p.id} className="player-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                         <div style={{ width: '40px', height: '40px', background: 'var(--color-cricket-green)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                            {p.name.charAt(0)}
                         </div>
                         <div style={{ fontWeight: 800, fontSize: '16px' }}>{p.name}</div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#666' }}>{p.type}</div>
                      <div>
                        {p.role !== 'None' && <span className="status-badge" style={{ background: '#f0f0ff', color: '#5a5ae0', border: '1px solid #d0d0fc' }}>{p.role}</span>}
                      </div>
                      {!isViewMode && (
                        <button onClick={() => removePlayerFromList(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}>
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  {players.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', border: '3px dashed #f0f2f5', borderRadius: '24px', color: '#999' }}>
                      <UserPlus size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                      <p style={{ fontWeight: 700 }}>No players enlisted yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="shopify-btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                {isViewMode ? 'Dismiss' : 'Cancel'}
              </button>
              {!isViewMode && (
                <button className="shopify-btn-primary" disabled={isSaving} onClick={handleSaveTeam}>
                  {isSaving ? 'Processing...' : (editingId ? 'Update Global Registry' : 'Save To Registry')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
