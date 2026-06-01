import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import PaceGenerator from './pages/PaceGenerator.jsx'
import HeartRateZones from './pages/HeartRateZones.jsx'
import TrainingPlan from './pages/TrainingPlan.jsx'
import TDEECalculator from './pages/TDEECalculator.jsx'
import StravaStats from './pages/StravaStats.jsx'
import Dashboard from './pages/Dashboard.jsx'
import './App.css'

const NAV_ITEMS = [
  { to: '/',           label: 'Dashboard',       icon: '⬡', end: true },
  { to: '/pace',       label: 'Pace Generator',  icon: '⏱' },
  { to: '/heart-rate', label: 'Heart Rate Zones',icon: '♥' },
  { to: '/training',   label: 'Training Plan',   icon: '📋' },
  { to: '/tdee',       label: 'TDEE Calculator', icon: '🔥' },
  { to: '/strava',     label: 'Strava Stats',    icon: '⚡' },
]

export default function App() {
  const location = useLocation()

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">◈</span>
          <div>
            <div className="brand-name">TriPace</div>
            <div className="brand-sub">Training Hub</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-text">Built for runners & triathletes</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="content-inner fade-up" key={location.pathname}>
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/pace"       element={<PaceGenerator />} />
            <Route path="/heart-rate" element={<HeartRateZones />} />
            <Route path="/training"   element={<TrainingPlan />} />
            <Route path="/tdee"       element={<TDEECalculator />} />
            <Route path="/strava"     element={<StravaStats />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
