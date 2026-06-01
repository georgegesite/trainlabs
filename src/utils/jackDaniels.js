/**
 * Jack Daniels' Running Formula — VDOT & training pace calculations
 *
 * VDOT tables and pace percentages sourced from:
 *   Daniels, J. (2014). Daniels' Running Formula (3rd ed.)
 */

// VDOT lookup table: [vdot, mile_seconds, 5k_seconds]
// We use these to find VDOT from a known race performance
const VDOT_TABLE = [
  [30, 1325, 2290], [31, 1290, 2227], [32, 1256, 2166], [33, 1224, 2108],
  [34, 1193, 2052], [35, 1164, 1999], [36, 1136, 1948], [37, 1110, 1899],
  [38, 1085, 1852], [39, 1061, 1808], [40, 1038, 1765], [41, 1016, 1724],
  [42,  995, 1684], [43,  975, 1646], [44,  956, 1609], [45,  938, 1574],
  [46,  921, 1540], [47,  904, 1508], [48,  888, 1476], [49,  873, 1446],
  [50,  858, 1417], [51,  844, 1389], [52,  831, 1362], [53,  818, 1336],
  [54,  806, 1311], [55,  794, 1287], [56,  782, 1263], [57,  771, 1241],
  [58,  761, 1219], [59,  751, 1198], [60,  741, 1178], [61,  732, 1158],
  [62,  723, 1139], [63,  714, 1121], [64,  705, 1103], [65,  697, 1086],
  [66,  689, 1069], [67,  682, 1053], [68,  674, 1037], [69,  667, 1022],
  [70,  661, 1008], [71,  654,  993], [72,  648,  979], [73,  641,  966],
  [74,  635,  953], [75,  630,  940], [76,  624,  927], [77,  619,  915],
  [78,  613,  903], [79,  608,  892], [80,  603,  881],
]

// % of VDOT race velocity for each training zone
// [Easy-low%, Easy-high%, Marathon%, Threshold%, Interval%, Repetition%]
// Daniels uses pace per km/mile, not %; we express as pace multiplier (>1 = slower)
const ZONE_PACES = {
  easy:       { lo: 1.29, hi: 1.23, label: 'Easy (E)',        desc: 'Conversational effort. Aerobic base building.' },
  marathon:   { lo: 1.11, hi: 1.09, label: 'Marathon (M)',    desc: 'Comfortably hard. Goal marathon pace.' },
  threshold:  { lo: 1.07, hi: 1.05, label: 'Threshold (T)',   desc: 'Comfortably hard / tempo. Lactate threshold.' },
  interval:   { lo: 1.01, hi: 0.98, label: 'Interval (I)',    desc: '5K race effort. VO2max development.' },
  repetition: { lo: 0.95, hi: 0.90, label: 'Repetition (R)', desc: 'Fast / mile race effort. Speed & economy.' },
}

/** Parse a "mm:ss" string into total seconds */
export function parseTime(str) {
  const parts = str.split(':').map(Number)
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return NaN
}

/** Format seconds → "mm:ss" */
export function fmtPace(sec) {
  if (!isFinite(sec) || sec <= 0) return '—'
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** Format seconds → "h:mm:ss" */
export function fmtTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.round(sec % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
  return `${m}:${s.toString().padStart(2,'0')}`
}

/** Known race distances in metres */
export const DISTANCES = {
  '1 Mile':           1609.34,
  '3K':               3000,
  '5K':               5000,
  '8K':               8000,
  '10K':              10000,
  'Half Marathon':    21097.5,
  'Marathon':         42195,
}

/**
 * Estimate VDOT from a race result.
 * Uses Daniels' formula: VDOT = (-4.6 + 0.182258*(d/t) + 0.000104*(d/t)^2)
 *                               / (0.8 + 0.1894393*e^(-0.012778*t) + 0.2989558*e^(-0.1932605*t))
 * where d = metres, t = seconds
 */
export function calcVDOT(distanceM, timeSec) {
  const v = distanceM / timeSec            // velocity m/s
  const vo2 = -4.6 + 0.182258 * v * 60 + 0.000104 * Math.pow(v * 60, 2)
  const pct  = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeSec / 60)
             + 0.2989558 * Math.exp(-0.1932605 * timeSec / 60)
  return vo2 / pct
}

/**
 * Given a VDOT, return training pace ranges (seconds per km)
 * We derive "race velocity" = pace that corresponds to VDOT using inverse of calcVDOT
 * Approximate: use 5K reference pace from table, then interpolate
 */
export function trainingPaces(vdot) {
  // Interpolate 5K time from table
  let lo = VDOT_TABLE[0], hi = VDOT_TABLE[VDOT_TABLE.length - 1]
  for (let i = 0; i < VDOT_TABLE.length - 1; i++) {
    if (vdot >= VDOT_TABLE[i][0] && vdot <= VDOT_TABLE[i + 1][0]) {
      lo = VDOT_TABLE[i]; hi = VDOT_TABLE[i + 1]; break
    }
  }
  const frac = (vdot - lo[0]) / (hi[0] - lo[0])
  const fiveKSec = lo[2] + frac * (hi[2] - lo[2])   // seconds for 5K
  const refPaceKm = fiveKSec / 5                      // sec/km at 5K race pace

  return Object.entries(ZONE_PACES).map(([key, z]) => ({
    key,
    label:    z.label,
    desc:     z.desc,
    loKm:     refPaceKm * z.lo,
    hiKm:     refPaceKm * z.hi,
    loMile:   refPaceKm * z.lo * 1.60934,
    hiMile:   refPaceKm * z.hi * 1.60934,
  }))
}
