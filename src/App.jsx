import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Calendar, 
  PlayCircle,
  FileBarChart,
  Search,
  Settings,
  Bell,
  Eye
} from 'lucide-react';

import './styles/App.css';

import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Tournaments from './pages/Tournaments';
import TournamentDetails from './pages/Tournaments/Details';
import Matches from './pages/Matches';
import MatchDetails from './pages/Matches/Details';
import Scoring from './pages/Scoring';

const TopNav = () => {
  return (
    <div className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ fontWeight: 800, fontSize: '20px', color: 'white' }}>GamaCricket</div>
      </div>

      <div className="search-container">
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        <input type="text" className="search-input" placeholder="Search" />
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: '10px', background: '#444', padding: '2px 4px', borderRadius: '4px' }}>CTRL K</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={{ background: '#303030', border: '1px solid #4a4a4a', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Eye size={14} /> View as
        </button>
        <Bell size={20} color="#e3e3e3" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: '#008060', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>GC</div>
          <span style={{ fontSize: '13px', fontWeight: 500 }}>Gama Dev</span>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard className="nav-icon" size={20} /> Home
      </NavLink>
      <NavLink to="/matches" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Calendar className="nav-icon" size={20} /> Matches
      </NavLink>
      <NavLink to="/tournaments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Trophy className="nav-icon" size={20} /> Tournaments
      </NavLink>
      <NavLink to="/teams" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Users className="nav-icon" size={20} /> Teams
      </NavLink>
      <NavLink to="/scoring" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <PlayCircle className="nav-icon" size={20} /> Live Scoring
      </NavLink>
      <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FileBarChart className="nav-icon" size={20} /> Analytics
      </NavLink>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
        <NavLink to="/settings" className="nav-item">
          <Settings className="nav-icon" size={20} /> Settings
        </NavLink>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <TopNav />
        <div className="layout-body">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:id" element={<TournamentDetails />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/:id" element={<MatchDetails />} />
            <Route path="/scoring/:id" element={<Scoring />} />
            <Route path="/reports" element={<div>Reports Placeholder</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
