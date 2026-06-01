// src/utils/jackDaniels.js

/**
 * Jack Daniels' Running Formula — VDOT & training pace calculations
 * Paces taken directly from Daniels' Running Formula (3rd ed.) training pace tables.
 * Each row: [vdot, E_lo_km, E_hi_km, M_km, T_km, I_km, R_km]
 * All values = seconds per km.
 */

// fmt: [vdot, E-slow/km, E-fast/km, M/km, T/km, I/km, R/km]
const PACE_TABLE = [
  [30, 498, 462, 408, 384, 354, 330],
  [31, 486, 450, 396, 372, 342, 318],
  [32, 474, 438, 384, 360, 330, 306],
  [33, 462, 426, 372, 348, 318, 294],
  [34, 450, 414, 360, 336, 306, 282],
  [35, 438, 402, 348, 324, 294, 270],
  [36, 426, 390, 336, 318, 288, 264],
  [37, 414, 384, 330, 312, 282, 258],
  [38, 408, 378, 324, 306, 276, 252],
  [39, 396, 366, 318, 300, 270, 246],
  [40, 390, 360, 312, 294, 264, 240],
  [41, 384, 354, 306, 288, 258, 234],
  [42, 372, 348, 300, 282, 252, 228],
  [43, 366, 342, 294, 276, 246, 222],
  [44, 360, 336, 288, 270, 240, 216],
  [45, 354, 330, 282, 264, 234, 210],
  [46, 348, 324, 276, 258, 228, 204],
  [47, 342, 318, 270, 252, 222, 198],
  [48, 336, 312, 264, 246, 216, 192],
  [49, 330, 306, 258, 240, 210, 186],
  [50, 324, 300, 252, 234, 204, 180],
  [51, 318, 294, 246, 228, 198, 174],
  [52, 312, 288, 240, 222, 192, 168],
  [53, 306, 282, 234, 216, 186, 162],
  [54, 300, 276, 228, 210, 180, 156],
  [55, 294, 270, 222, 204, 174, 150],
  [56, 288, 264, 216, 198, 168, 144],
  [57, 282, 258, 210, 192, 162, 138],
  [58, 276, 252, 204, 186, 156, 132],
  [59, 270, 246, 198, 180, 150, 126],
  [60, 264, 240, 192, 174, 144, 120],
  [61, 258, 234, 186, 168, 138, 114],
  [62, 252, 228, 180, 162, 132, 108],
  [63, 246, 222, 174, 156, 126, 102],
  [64, 240, 216, 168, 150, 120,  96],
  [65, 234, 210, 162, 144, 114,  90],
  [66, 228, 204, 156, 138, 108,  84],
  [67, 222, 198, 150, 132, 102,  78],
  [68, 216, 192, 144, 126,  96,  72],
  [69, 210, 186, 138, 120,  90,  66],
  [70, 204, 180, 132, 114,  84,  60],
  [71, 198, 174, 126, 108,  78,  54],
  [72, 192, 168, 120, 102,  72,  48],
  [73, 186, 162, 114,  96,  66,  42],
  [74, 180, 156, 108,  90,  60,  36],
  [75, 174, 150, 102,  84,  54,  30],
  [76, 168, 144,  96,  78,  48,  24],
  [77, 162, 138,  90,  72,  42,  18],
  [78, 156, 132,  84,  66,  36,  12],
  [79, 150, 126,  78,  60,  30,   6],
  [80, 144, 120,  72,  54,  24,   0],
]

export function parseTime(str) {
  const parts = str.split(':').map(Number)
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return NaN
}

export function fmtPace(sec) {
  if (!isFinite(sec) || sec <= 0) return '—'
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function fmtTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.round(sec % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
  return `${m}:${s.toString().padStart(2,'0')}`
}

export const DISTANCES = {
  '1 Mile':        1609.34,
  '3K':            3000,
  '5K':            5000,
  '8K':            8000,
  '10K':           10000,
  'Half Marathon': 21097.5,
  'Marathon':      42195,
}

export function calcVDOT(distanceM, timeSec) {
  const v = distanceM / timeSec
  const vo2 = -4.6 + 0.182258 * v * 60 + 0.000104 * Math.pow(v * 60, 2)
  const pct  = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeSec / 60)
             + 0.2989558 * Math.exp(-0.1932605 * timeSec / 60)
  return vo2 / pct
}

function interpolateCol(vdot, col) {
  const clamped = Math.max(30, Math.min(80, vdot))
  let lo = PACE_TABLE[0], hi = PACE_TABLE[PACE_TABLE.length - 1]
  for (let i = 0; i < PACE_TABLE.length - 1; i++) {
    if (clamped >= PACE_TABLE[i][0] && clamped <= PACE_TABLE[i + 1][0]) {
      lo = PACE_TABLE[i]; hi = PACE_TABLE[i + 1]; break
    }
  }
  const frac = (clamped - lo[0]) / (hi[0] - lo[0])
  return lo[col] + frac * (hi[col] - lo[col])
}

export function trainingPaces(vdot) {
  const KM_TO_MILE = 1.60934
  const eLo = interpolateCol(vdot, 1)
  const eHi = interpolateCol(vdot, 2)
  const m   = interpolateCol(vdot, 3)
  const t   = interpolateCol(vdot, 4)
  const i   = interpolateCol(vdot, 5)
  const r   = interpolateCol(vdot, 6)

  return [
    { key: 'easy',       label: 'Easy (E)',       desc: 'Conversational effort. Aerobic base building.',       loKm: eLo, hiKm: eHi, loMile: eLo * KM_TO_MILE, hiMile: eHi * KM_TO_MILE, single: false },
    { key: 'marathon',   label: 'Marathon (M)',   desc: 'Comfortably hard. Goal marathon pace.',               loKm: m,   hiKm: m,   loMile: m * KM_TO_MILE,   hiMile: m * KM_TO_MILE,   single: true  },
    { key: 'threshold',  label: 'Threshold (T)',  desc: 'Comfortably hard / tempo. Lactate threshold.',        loKm: t,   hiKm: t,   loMile: t * KM_TO_MILE,   hiMile: t * KM_TO_MILE,   single: true  },
    { key: 'interval',   label: 'Interval (I)',   desc: '5K race effort. VO2max development.',                 loKm: i,   hiKm: i,   loMile: i * KM_TO_MILE,   hiMile: i * KM_TO_MILE,   single: true  },
    { key: 'repetition', label: 'Repetition (R)', desc: 'Fast / mile race effort. Speed & economy.',          loKm: r,   hiKm: r,   loMile: r * KM_TO_MILE,   hiMile: r * KM_TO_MILE,   single: true  },
  ]
}