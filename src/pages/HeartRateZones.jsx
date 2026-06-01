import { useState } from 'react'
import './HeartRateZones.css'
const ZONES = [
  { id: 1, label: 'Zone 1', name: 'Easy',             lo: 0.68, hi: 0.73, color: '#60a5fa', desc: 'Active recovery. Very light effort. Use for warm-up, cool-down, easy days.' },
  { id: 2, label: 'Zone 2', name: 'Steady',         lo: 0.73, hi: 0.80, color: '#34d399', desc: 'Fat-burning zone. Conversational effort. Foundation of aerobic fitness.' },
  { id: 3, label: 'Zone 3', name: 'Moderately Hard',  lo: 0.80, hi: 0.87, color: '#fbbf24', desc: 'Comfortably hard. Tempo / marathon pace effort. Builds aerobic capacity.' },
  { id: 4, label: 'Zone 4', name: 'Hard',  lo: 0.87, hi: 0.93, color: '#fb923c', desc: 'Hard effort. Lactate threshold training. Race pace for 10K–half marathon.' },
  { id: 5, label: 'Zone 5', name: 'Max Effort',  lo: 0.93, hi: 1.00, color: '#f87171', desc: 'Maximum effort. Short intervals. Neuromuscular & VO2max development.' },
]

function estimateHRmax(age) {
  // Nes (or HUNT) formula : HRmax = 211 − 0.64 × age (more accurate than 220-age)
  return Math.round(211 - 0.64 * age)
}

export default function HeartRateZones() {
  const [age, setAge]           = useState('')
  const [hrMax, setHrMax]       = useState('')
  const [useEstimate, setUseEstimate] = useState(true)
  const [results, setResults]   = useState(null)
  const [error, setError]       = useState('')

  function calculate() {
    setError('')
    let max
    if (useEstimate) {
      const a = parseInt(age)
      if (!a || a < 10 || a > 100) { setError('Enter a valid age (10–100).'); return }
      max = estimateHRmax(a)
    } else {
      max = parseInt(hrMax)
      if (!max || max < 100 || max > 230) { setError('Enter a valid HRmax (100–230 bpm).'); return }
    }
    setResults({ hrMax: max, zones: ZONES.map(z => ({
      ...z,
      bpmLo: Math.round(max * z.lo),
      bpmHi: Math.round(max * z.hi),
    })) })
  }

  return (
    <div>
      <div className="page-header">
        <h1>Heart Rate Zones</h1>
        <p>Use this simple calculator to estimate your heart rate training zones based on your age, or enter your exact maximal heart rate if you know it.</p>
      </div>

      <div className="card hr-inputs">
        <div className="hr-method-toggle">
          <button
            className={`method-btn ${useEstimate ? 'active' : ''}`}
            onClick={() => setUseEstimate(true)}
          >
            Estimate from Age
          </button>
          <button
            className={`method-btn ${!useEstimate ? 'active' : ''}`}
            onClick={() => setUseEstimate(false)}
          >
            Enter HRmax Directly
          </button>
        </div>

        <div className="hr-input-row">
          {useEstimate ? (
            <div className="input-group">
              <label className="label">Your Age</label>
              <input
                type="number"
                placeholder="e.g. 32"
                value={age}
                onChange={e => setAge(e.target.value)}
                min={10} max={100}
              />
              <div className="input-hint">Uses Tanaka formula: HRmax = 208 − 0.7 × age</div>
            </div>
          ) : (
            <div className="input-group">
              <label className="label">Measured HRmax (bpm)</label>
              <input
                type="number"
                placeholder="e.g. 185"
                value={hrMax}
                onChange={e => setHrMax(e.target.value)}
                min={100} max={230}
              />
              <div className="input-hint">Use your highest recorded heart rate from a hard effort or lab test.</div>
            </div>
          )}
        </div>

        {error && <div className="error-msg">{error}</div>}
        <button className="btn-primary" onClick={calculate}>Calculate Zones</button>
      </div>

      {results && (
        <div className="hr-results fade-up">
          <div className="card-sm hrmax-display">
            <div className="label">Your HRmax</div>
            <div className="big-num">{results.hrMax} <span style={{ fontSize: 20, color: 'var(--text-2)' }}>bpm</span></div>
          </div>

          <div className="zones-list">
            {results.zones.map(z => (
              <div key={z.id} className="zone-card" style={{ '--zc': z.color }}>
                <div className="zone-left">
                  <div className="zone-number" style={{ color: z.color }}>{z.label}</div>
                  <div className="zone-name">{z.name}</div>
                </div>
                <div className="zone-bar-wrap">
                  <div
                    className="zone-bar"
                    style={{
                      width: `${(z.hi - z.lo) * 100 * 2}%`,
                      left: `${(z.lo - 0.5) * 100 * 2}%`,
                      background: z.color,
                    }}
                  />
                </div>
                <div className="zone-bpm">
                  <span className="bpm-range" style={{ color: z.color }}>
                    {z.bpmLo}–{z.bpmHi}
                  </span>
                  <span className="bpm-unit">bpm</span>
                </div>
                <div className="zone-desc-col">{z.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
