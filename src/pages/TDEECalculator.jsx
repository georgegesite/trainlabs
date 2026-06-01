import { useState } from 'react'
import './TDEECalculator.css'

/**
 * TDEE Calculator
 * BMR: Mifflin-St Jeor equation (most accurate for general population)
 * TDEE: BMR × activity multiplier
 * Macro split options following standard performance nutrition guidelines
 */

const ACTIVITY_LEVELS = [
  { value: 1.2,   label: 'Sedentary',         desc: 'Little or no exercise' },
  { value: 1.375, label: 'Lightly Active',     desc: '1–3 days/week light exercise' },
  { value: 1.55,  label: 'Moderately Active',  desc: '3–5 days/week moderate exercise' },
  { value: 1.725, label: 'Very Active',         desc: '6–7 days/week hard exercise' },
  { value: 1.9,   label: 'Extra Active',        desc: 'Very hard exercise + physical job' },
]

const GOALS = [
  { id: 'cut',      label: '🔻 Cut',         adj: -500, desc: 'Lose ~0.5kg/week' },
  { id: 'maintain', label: '⚖️ Maintain',    adj: 0,    desc: 'Maintain weight' },
  { id: 'bulk',     label: '📈 Bulk',        adj: 300,  desc: 'Lean gain ~0.25kg/week' },
  { id: 'perf',     label: '⚡ Performance',  adj: 200,  desc: 'Optimise for endurance' },
]

function calcBMR(weight, height, age, sex) {
  // Mifflin-St Jeor
  const base = 10 * weight + 6.25 * height - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

function calcMacros(calories, goal) {
  // Endurance athlete macro ratios
  const ratios = {
    cut:      { p: 0.35, f: 0.25, c: 0.40 },
    maintain: { p: 0.25, f: 0.25, c: 0.50 },
    bulk:     { p: 0.25, f: 0.25, c: 0.50 },
    perf:     { p: 0.20, f: 0.25, c: 0.55 },
  }
  const r = ratios[goal]
  return {
    protein: Math.round((calories * r.p) / 4),
    fat:     Math.round((calories * r.f) / 9),
    carbs:   Math.round((calories * r.c) / 4),
  }
}

export default function TDEECalculator() {
  const [weight, setWeight]   = useState('')
  const [height, setHeight]   = useState('')
  const [age, setAge]         = useState('')
  const [sex, setSex]         = useState('male')
  const [activity, setActivity] = useState(1.55)
  const [goal, setGoal]       = useState('maintain')
  const [unit, setUnit]       = useState('metric')  // metric | imperial
  const [results, setResults] = useState(null)
  const [error, setError]     = useState('')

  function calculate() {
    setError('')
    let wKg, hCm

    if (unit === 'metric') {
      wKg = parseFloat(weight)
      hCm = parseFloat(height)
    } else {
      wKg = parseFloat(weight) * 0.453592      // lbs → kg
      hCm = parseFloat(height) * 2.54          // inches → cm
    }

    const a = parseInt(age)

    if (!wKg || wKg < 30 || wKg > 300) { setError('Enter a valid weight.'); return }
    if (!hCm || hCm < 100 || hCm > 250) { setError('Enter a valid height.'); return }
    if (!a || a < 15 || a > 100)         { setError('Enter a valid age.'); return }

    const bmr  = calcBMR(wKg, hCm, a, sex)
    const tdee = Math.round(bmr * activity)
    const goalObj = GOALS.find(g => g.id === goal)
    const targetCal = tdee + goalObj.adj
    const macros = calcMacros(targetCal, goal)

    setResults({ bmr: Math.round(bmr), tdee, targetCal, macros, goalLabel: goalObj.label })
  }

  return (
    <div>
      <div className="page-header">
        <h1>TDEE Calculator</h1>
        <p>Total Daily Energy Expenditure — know your calories to fuel training, recovery, and your goals.</p>
      </div>

      <div className="card tdee-form">
        {/* Unit toggle */}
        <div className="tdee-unit-toggle">
          <button className={`method-btn ${unit === 'metric' ? 'active' : ''}`} onClick={() => setUnit('metric')}>Metric (kg / cm)</button>
          <button className={`method-btn ${unit === 'imperial' ? 'active' : ''}`} onClick={() => setUnit('imperial')}>Imperial (lbs / in)</button>
        </div>

        <div className="tdee-row">
          <div className="input-group">
            <label className="label">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input type="number" placeholder={unit === 'metric' ? '70' : '154'} value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="label">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
            <input type="number" placeholder={unit === 'metric' ? '175' : '69'} value={height} onChange={e => setHeight(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="label">Age</label>
            <input type="number" placeholder="30" value={age} onChange={e => setAge(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="label">Biological Sex</label>
            <select value={sex} onChange={e => setSex(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="label">Activity Level</label>
          <div className="activity-grid">
            {ACTIVITY_LEVELS.map(a => (
              <button
                key={a.value}
                className={`activity-btn ${activity === a.value ? 'active' : ''}`}
                onClick={() => setActivity(a.value)}
              >
                <div className="activity-label">{a.label}</div>
                <div className="activity-desc">{a.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label className="label">Goal</label>
          <div className="goal-grid">
            {GOALS.map(g => (
              <button
                key={g.id}
                className={`goal-btn ${goal === g.id ? 'active' : ''}`}
                onClick={() => setGoal(g.id)}
              >
                <div>{g.label}</div>
                <div className="goal-desc">{g.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}
        <button className="btn-primary" onClick={calculate}>Calculate TDEE</button>
      </div>

      {results && (
        <div className="tdee-results fade-up">
          <div className="cal-cards">
            <div className="cal-card card-sm">
              <div className="label">BMR</div>
              <div className="big-num">{results.bmr}<span className="cal-unit"> kcal</span></div>
              <div className="cal-note">Basal Metabolic Rate — calories at rest</div>
            </div>
            <div className="cal-card card-sm">
              <div className="label">TDEE</div>
              <div className="big-num" style={{ color: 'var(--blue)' }}>{results.tdee}<span className="cal-unit"> kcal</span></div>
              <div className="cal-note">Total daily expenditure</div>
            </div>
            <div className="cal-card card-sm">
              <div className="label">Target {results.goalLabel}</div>
              <div className="big-num" style={{ color: 'var(--warn)' }}>{results.targetCal}<span className="cal-unit"> kcal</span></div>
              <div className="cal-note">Adjusted for your goal</div>
            </div>
          </div>

          <div className="card macro-card">
            <div className="label" style={{ marginBottom: 16 }}>Recommended Macros</div>
            <div className="macro-bars">
              {[
                { name: 'Carbs',   g: results.macros.carbs,   color: '#fbbf24', pct: results.macros.carbs * 4 },
                { name: 'Protein', g: results.macros.protein, color: '#34d399', pct: results.macros.protein * 4 },
                { name: 'Fat',     g: results.macros.fat,     color: '#fb923c', pct: results.macros.fat * 9 },
              ].map(m => {
                const pctLabel = Math.round(m.pct / results.targetCal * 100)
                return (
                  <div key={m.name} className="macro-row">
                    <div className="macro-label" style={{ color: m.color }}>{m.name}</div>
                    <div className="macro-bar-wrap">
                      <div className="macro-bar-fill" style={{ width: `${pctLabel}%`, background: m.color }} />
                    </div>
                    <div className="macro-grams"><strong>{m.g}g</strong> <span className="macro-pct">{pctLabel}%</span></div>
                  </div>
                )
              })}
            </div>
            <div className="macro-footnote">Endurance-optimised split. Adjust protein if doing strength work.</div>
          </div>
        </div>
      )}
    </div>
  )
}
