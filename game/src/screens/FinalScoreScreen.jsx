import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useGameStore, MOCK_PLAYERS } from '../store/gameStore'
import Button from '../components/Button'

const sorted = [...MOCK_PLAYERS].sort((a, b) => b.score - a.score)

const TROPHIES = ['🥇', '🥈', '🥉']
const TROPHY_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']

export default function FinalScoreScreen() {
  const { reset } = useGameStore()
  const canvasRef = useRef(null)

  useEffect(() => {
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#58CC02', '#1CB0F6', '#FFD700', '#FF9600', '#FF4B4B'],
      })
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60, spread: 55,
          origin: { x: 0, y: 0.5 },
          colors: ['#58CC02', '#FFD700'],
        })
        confetti({
          particleCount: 60,
          angle: 120, spread: 55,
          origin: { x: 1, y: 0.5 },
          colors: ['#1CB0F6', '#FF9600'],
        })
      }, 400)
    })
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '32px 20px 120px', gap: 20,
    }}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
        style={{ textAlign: 'center' }}
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 1.5, delay: 0.5, repeat: 2 }}
          style={{ fontSize: 56, marginBottom: 8 }}
        >
          🏆
        </motion.div>
        <h1 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 30, color: 'white', margin: 0 }}>Game Over!</h1>
        <p style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: '6px 0 0' }}>Final Standings — 7 rounds</p>
      </motion.div>

      {/* Top 3 podium */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', justifyContent: 'center', width: '100%' }}>
        {[1, 0, 2].map((rankIdx, col) => {
          const p = sorted[rankIdx]
          if (!p) return null
          const heights = [90, 110, 75]
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + col * 0.15, type: 'spring', stiffness: 250, damping: 18 }}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6,
              }}
            >
              <span style={{ fontSize: 28 }}>{TROPHIES[rankIdx]}</span>
              <div style={{
                width: 46, height: 46, borderRadius: '50%',
                background: p.color + '30',
                border: `3px solid ${TROPHY_COLORS[rankIdx]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Nunito', fontWeight: 900, fontSize: 18, color: p.color,
                boxShadow: `0 0 16px ${TROPHY_COLORS[rankIdx]}50`,
              }}>
                {p.name[0]}
              </div>
              <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 14, color: 'white' }}>{p.name}</span>
              <div style={{
                width: '100%', height: heights[col],
                background: `linear-gradient(180deg, ${TROPHY_COLORS[rankIdx]}25, ${TROPHY_COLORS[rankIdx]}08)`,
                border: `1.5px solid ${TROPHY_COLORS[rankIdx]}40`,
                borderRadius: '10px 10px 0 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 22, color: TROPHY_COLORS[rankIdx] }}>{p.score}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Full list */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 280, damping: 22 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: i === 0 ? 'rgba(255,215,0,0.08)' : 'rgba(255,255,255,0.04)',
              border: i === 0 ? '1.5px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '10px 14px',
            }}
          >
            <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 16, minWidth: 28, color: i < 3 ? TROPHY_COLORS[i] : 'rgba(255,255,255,0.3)' }}>
              {i < 3 ? TROPHIES[i] : `#${i + 1}`}
            </span>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: p.color + '25', border: `2px solid ${p.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Nunito', fontWeight: 900, fontSize: 14, color: p.color,
            }}>
              {p.name[0]}
            </div>
            <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'white', flex: 1 }}>{p.name}</span>
            <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 20, color: i === 0 ? '#FFD700' : 'white' }}>{p.score}</span>
            <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>pts</span>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <Button variant="primary" fullWidth onClick={() => reset()}>
          🔄 Play Again
        </Button>
        <Button variant="ghost" fullWidth onClick={() => {}}>
          📤 Share Results
        </Button>
      </div>
    </div>
  )
}
