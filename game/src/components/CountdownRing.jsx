import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

export default function CountdownRing({ total = 60, remaining = 45, size = 120, strokeWidth = 10 }) {
  const pct = Math.max(0, Math.min(1, remaining / total))
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - pct)

  const color = pct > 0.3 ? '#58CC02' : pct > 0.1 ? '#FF9600' : '#FF4B4B'

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{
            strokeDashoffset: offset,
            stroke: color,
          }}
          transition={{
            strokeDashoffset: { duration: 0.8, ease: 'easeOut' },
            stroke: { duration: 0.4 },
          }}
          style={{ stroke: color, filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.span
          key={remaining}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: size * 0.22, color: 'white', lineHeight: 1 }}
        >
          {remaining}
        </motion.span>
        <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: size * 0.1, color: 'rgba(255,255,255,0.4)' }}>secs</span>
      </div>
      {/* Pulse ring when critical */}
      {pct < 0.15 && (
        <motion.div
          style={{
            position: 'absolute', inset: -4,
            borderRadius: '50%',
            border: `3px solid ${color}`,
          }}
          animate={{ opacity: [1, 0], scale: [1, 1.15] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  )
}
