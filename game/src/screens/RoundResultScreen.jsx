import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useGameStore, MOCK_PLAYERS, MOCK_ANSWERS } from '../store/gameStore'
import Button from '../components/Button'

const VOTE_DATA = [
  { name: 'Khalid', votes: 4, color: '#4ECDC4' },
  { name: 'Sara',   votes: 1, color: '#FF6B6B' },
  { name: 'Noor',   votes: 1, color: '#96E6A1' },
]

export default function RoundResultScreen() {
  const { roundResult, crewPrompt, imposterPrompt, setPhase, players } = useGameStore()
  const [showPrompts, setShowPrompts] = useState(false)
  const [showScores, setShowScores] = useState(false)
  const isCrewWin = roundResult === 'CREW_WIN'

  useEffect(() => {
    const t1 = setTimeout(() => setShowPrompts(true), 1200)
    const t2 = setTimeout(() => setShowScores(true), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '28px 20px 120px', gap: 18,
    }}>
      {/* Result banner */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: -30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 16 }}
        style={{
          textAlign: 'center', padding: '20px 28px',
          background: isCrewWin
            ? 'linear-gradient(135deg, rgba(88,204,2,0.2), rgba(88,204,2,0.05))'
            : 'linear-gradient(135deg, rgba(255,75,75,0.2), rgba(255,75,75,0.05))',
          border: isCrewWin ? '2px solid rgba(88,204,2,0.4)' : '2px solid rgba(255,75,75,0.4)',
          borderRadius: 24, width: '100%',
        }}
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ fontSize: 52, marginBottom: 8 }}
        >
          {isCrewWin ? '🎉' : '😈'}
        </motion.div>
        <h2 style={{
          fontFamily: 'Nunito', fontWeight: 900, fontSize: 26,
          color: isCrewWin ? '#58CC02' : '#FF4B4B', margin: 0,
        }}>
          {isCrewWin ? 'Crew Wins!' : 'Imposter Wins!'}
        </h2>
        <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: '6px 0 0' }}>
          The Imposter was <strong style={{ color: '#4ECDC4' }}>Khalid</strong> {isCrewWin ? '— caught! ✓' : '— escaped! 😏'}
        </p>
      </motion.div>

      {/* Votes breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1 }}>Vote Breakdown</p>
        {VOTE_DATA.map((v, i) => (
          <div key={v.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < VOTE_DATA.length - 1 ? 8 : 0 }}>
            <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 14, color: v.color, minWidth: 60 }}>{v.name}</span>
            <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(v.votes / 6) * 100}%` }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.6, ease: 'easeOut' }}
                style={{ height: '100%', background: v.color, borderRadius: 4 }}
              />
            </div>
            <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 14, color: 'white', minWidth: 20 }}>{v.votes}</span>
          </div>
        ))}
      </motion.div>

      {/* Prompts reveal */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: showPrompts ? 1 : 0, y: showPrompts ? 0 : 16 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {[
          { label: '🛡️ Crew Prompt', text: crewPrompt, color: '#58CC02' },
          { label: '☠️ Imposter Prompt', text: imposterPrompt, color: '#FF4B4B' },
        ].map(p => (
          <div key={p.label} style={{
            background: `${p.color}12`,
            border: `1.5px solid ${p.color}30`,
            borderRadius: 14, padding: '10px 14px',
          }}>
            <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 11, color: p.color, textTransform: 'uppercase', letterSpacing: 1 }}>{p.label}</span>
            <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, color: 'white', margin: '4px 0 0' }}>{p.text}</p>
          </div>
        ))}
      </motion.div>

      {/* Scores */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: showScores ? 1 : 0, y: showScores ? 0 : 16 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1 }}>Scores</p>
        {players.sort((a, b) => b.score - a.score).map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < players.length - 1 ? 8 : 0 }}>
            <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 13, color: 'rgba(255,255,255,0.35)', minWidth: 18 }}>#{i + 1}</span>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: p.color + '25', border: `2px solid ${p.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Nunito', fontWeight: 900, fontSize: 12, color: p.color,
            }}>{p.name[0]}</div>
            <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 14, color: 'white', flex: 1 }}>{p.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {p.delta > 0 && (
                <motion.span
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -20 }}
                  transition={{ duration: 1.5, delay: 0.8 + i * 0.1 }}
                  style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 13, color: '#58CC02' }}
                >
                  +{p.delta}
                </motion.span>
              )}
              <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 18, color: 'white' }}>{p.score}</span>
            </div>
          </div>
        ))}
      </motion.div>

      <Button variant="primary" fullWidth onClick={() => setPhase('final-score')}>
        Next Round →
      </Button>
    </div>
  )
}
