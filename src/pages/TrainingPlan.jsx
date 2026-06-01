import './ComingSoon.css'

export default function TrainingPlan() {
  return (
    <div>
      <div className="page-header">
        <h1>Training Plan</h1>
        <p>Structured weekly plans tailored to your goal race and current fitness.</p>
      </div>
      <ComingSoonCard
        icon="📋"
        title="Training Plan Generator"
        features={[
          'Goal race selector (5K, 10K, HM, Marathon, Sprint Tri, Olympic, 70.3)',
          'Current fitness level assessment',
          'Auto-generated weekly periodised plan',
          'Integrates with your VDOT and HR zones',
          'PDF export for offline use',
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
