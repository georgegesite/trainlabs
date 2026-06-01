import './ComingSoon.css'

export default function StravaStats() {
  return (
    <div>
      <div className="page-header">
        <h1>Strava Stats</h1>
        <p>Connect Strava to visualise your training load, trends, and performance over time.</p>
      </div>
      <ComingSoonCard
        icon="⚡"
        title="Strava Integration"
        features={[
          'OAuth2 connect with Strava',
          'Weekly / monthly training load charts',
          'Pace trend over time by activity type',
          'Fitness & Fatigue (CTL/ATL) model',
          'Best efforts and PRs dashboard',
        ]}
      />
    </div>
  )
}

function ComingSoonCard({ icon, title, features }) {
  return (
    <div className="coming-soon-card card">
      <div className="cs-icon">{icon}</div>
      <div className="cs-badge label">In Development</div>
      <h2 className="cs-title">{title}</h2>
      <p className="cs-sub">This feature is actively being built. Here's what's planned:</p>
      <ul className="cs-features">
        {features.map((f, i) => (
          <li key={i}><span className="cs-check">✓</span>{f}</li>
        ))}
      </ul>
    </div>
  )
}
