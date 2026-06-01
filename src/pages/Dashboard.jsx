import { Link } from 'react-router-dom'
import './Dashboard.css'

const TOOLS = [
  {
    to: '/pace',
    icon: '⏱',
    title: 'Pace Generator',
    desc: "Jack Daniels' formula — VDOT-based training paces for every intensity zone.",
    color: '#00e5a0',
  },
  {
    to: '/heart-rate',
    icon: '♥',
    title: 'Heart Rate Zones',
    desc: 'proCoach THR/HR Max method for personalised aerobic & anaerobic zones.',
    color: '#f87171',
  },
  {
    to: '/training',
    icon: '📋',
    title: 'Training Plan',
    desc: 'Structured weekly plans tailored to your goal race and fitness level.',
    color: '#fbbf24',
    badge: 'Coming Soon',
  },
  {
    to: '/tdee',
    icon: '🔥',
    title: 'TDEE Calculator',
    desc: 'Total Daily Energy Expenditure — fuelling your training and recovery.',
    color: '#fb923c',
  },
  {
    to: '/strava',
    icon: '⚡',
    title: 'Strava Stats',
    desc: 'Connect your Strava account and visualise your training load over time.',
    color: '#fc4c02',
    badge: 'Coming Soon',
  },
]

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div className="dash-eyebrow label">Welcome to</div>
        <h1 className="dash-title">TriPace<br />Training Hub</h1>
        <p>Your all-in-one toolkit for running and triathlon performance. Pick a tool below to get started.</p>
      </div>

      <div className="tool-grid">
        {TOOLS.map(tool => (
          <Link to={tool.to} key={tool.to} className="tool-card" style={{ '--card-color': tool.color }}>
            <div className="tool-card-header">
              <span className="tool-icon">{tool.icon}</span>
              {tool.badge && <span className="tool-badge">{tool.badge}</span>}
            </div>
            <h3 className="tool-title">{tool.title}</h3>
            <p className="tool-desc">{tool.desc}</p>
            <div className="tool-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
