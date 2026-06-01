import { useState } from 'react'
import { calcVDOT, trainingPaces, fmtPace, parseTime, DISTANCES } from '../utils/jackDaniels.js'
import './PaceGenerator.css'

export default function PaceGenerator() {
  const [distance, setDistance] = useState('5K')
  const [timeInput, setTimeInput] = useState('')
  const [unit, setUnit] = useState('km')
  const [results, setResults] = useState(null)
  const [vdot, setVdot] = useState(null)
  const [error, setError] = useState('')

  function calculate() {
    setError('')
    const timeSec = parseTime(timeInput)
    if (isNaN(timeSec) || timeSec <= 0) {
      setError('Enter a valid time in mm:ss or h:mm:ss format.')
      return
    }
    const distM = DISTANCES[distance]
    const v = calcVDOT(distM, timeSec)
    if (v < 28 || v > 85) {
      setError('Time seems outside realistic range. Check your input.')
      return
    }
    setVdot(Math.round(v * 10) / 10)
    setResults(trainingPaces(v))
  }

  return (
    <div>
      <div className="page-header">
        <h1>Pace Generator</h1>
        <p>
          Enter a recent race result to calculate your VDOT and Jack Daniels
          training paces.
        </p>
      </div>

      <div className="pace-inputs card">
        <div className="input-row">
          <div className="input-group">
            <label className="label">Race Distance</label>
            <select
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            >
              {Object.keys(DISTANCES).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="label">Finish Time</label>
            <input
              type="text"
              placeholder={distance === "1 Mile" ? "mm:ss" : "h:mm:ss"}
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculate()}
            />
          </div>

          <div className="input-group">
            <label className="label">Pace Unit</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="km">per km</option>
              <option value="mile">per mile</option>
            </select>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button className="btn-primary" onClick={calculate}>
          Calculate Paces
        </button>
      </div>

      {results && (
        <div className="pace-results fade-up">
          <div className="vdot-display card-sm">
            <div className="label">Estimated VDOT</div>
            <div className="big-num">{vdot}</div>
            <p className="vdot-note">
              VDOT represents your current aerobic fitness. Higher = better.
            </p>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="label" style={{ marginBottom: 16 }}>
              Training Pace Zones
            </div>
            <table className="result-table">
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Slow end</th>
                  <th>Fast end</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                {results.map((z, i) => (
                  <tr key={z.key}>
                    <td>
                      <span className={`zone-pill zone-${i + 1}`}>
                        {z.label}
                      </span>
                    </td>
                    {z.single ? (
                      <td className="mono" colSpan={2}>
                        {fmtPace(unit === "km" ? z.loKm : z.loMile)} /{unit}
                      </td>
                    ) : (
                      <>
                        <td className="mono">
                          {fmtPace(unit === "km" ? z.loKm : z.loMile)} /{unit}
                        </td>
                        <td className="mono">
                          {fmtPace(unit === "km" ? z.hiKm : z.hiMile)} /{unit}
                        </td>
                      </>
                    )}
                    <td className="zone-desc">{z.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
