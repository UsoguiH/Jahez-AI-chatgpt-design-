import { motion } from 'framer-motion'
import { useState } from 'react'
import { useGameStore, MOCK_ANSWERS } from '../store/gameStore'
import CountdownRing from '../components/CountdownRing'
import Button from '../components/Button'

export default function DebateScreen() {
  const { susMarks, toggleSus, setPhase } = useGameStore()
  const [remaining, setRemaining] = useState(45)
  const [view, setView] = useState('phone')

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A2E', display: 'flex', flexDirection: 'column' }}>
      {/* View toggle */}
      <div style={{ padding: '14px 20px 0', display: 'flex', gap: 8, justifyContent: 'center' }}>
        {['phone', 'display'].map(v => (
          <motion.button key={v} onClick={() => setView(v)} whileTap={{ scale: 0.95 }}
            style={{
              padding: '7px 16px', borderRadius: 30, border: 'none', cursor: 'pointer',
              fontFamily: 'Nunito', fontWeight: 800, fontSize: 12,
              background: view === v ? '#FF9600' : 'rgba(255,255,255,0.08)',
              color: view === v ? 'white' : 'rgba(255,255,255,0.4)',
              boxShadow: view === v ? '0 3px 0 #CC7800' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {v === 'phone' ? '📱 My Phone' : '📺 Shared Screen'}
          </motion.button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 120px', gap: 20 }}>
        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
        >
          <motion.h2
            animate={{ color: remaining < 10 ? '#FF4B4B' : '#FF9600' }}
            style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 22, margin: 0 }}
          >
            💬 DEBATE TIME!
          </motion.h2>
          <CountdownRing total={60} remaining={remaining} size={view === 'display' ? 110 : 90} />
          <div style={{ display: 'flex', gap: 8 }}>
            {[30, 15, 5].map(jump => (
              <motion.button key={jump} whileTap={{ scale: 0.9 }}
                onClick={() => setRemaining(r => Math.max(0, r - jump))}
                style={{
                  padding: '5px 12px', borderRadius: 20, border: '1.5px solid rgba(255,255,255,0.2)',
                  background: 'transparent', color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                }}
              >
                -{jump}s
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Player cards with sus */}
        <div style={{ width: '100%' }}>
          <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1 }}>
            {view === 'phone' ? 'Tap ☠️ to mark as suspicious' : 'All Answers'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOCK_ANSWERS.map((a, i) => {
              const isSus = susMarks.includes(a.playerId)
              return (
                <motion.div key={a.playerId}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: isSus ? 'rgba(255,75,75,0.1)' : 'rgba(255,255,255,0.05)',
                    border: isSus ? '1.5px solid rgba(255,75,75,0.35)' : '1.5px solid rgba(255,255,255,0.07)',
                    borderRadius: 14, padding: '10px 14px',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: a.color + '25', border: `2px solid ${a.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Nunito', fontWeight: 900, fontSize: 14, color: a.color,
                    flexShrink: 0,
                  }}>
                    {a.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: 'white' }}>{a.name}</span>
                  </div>
                  <span style={{
                    fontFamily: 'Nunito', fontWeight: 900, fontSize: 22,
                    color: a.color, minWidth: 40, textAlign: 'center',
                  }}>
                    {a.answer}
                  </span>
                  {view === 'phone' && (
                    <motion.button
                      onClick={() => toggleSus(a.playerId)}
                      whileTap={{ scale: 0.8 }}
                      animate={isSus ? { rotate: [0, -10, 10, -5, 0] } : {}}
                      style={{
                        width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                        background: isSus ? 'rgba(255,75,75,0.3)' : 'rgba(255,255,255,0.08)',
                        fontSize: 18, flexShrink: 0,
                      }}
                    >
                      {isSus ? '☠️' : '👀'}
                    </motion.button>
                  )}
                  {isSus && (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      style={{
                        background: '#FF4B4B', borderRadius: 8, padding: '2px 8px',
                        fontFamily: 'Nunito', fontWeight: 900, fontSize: 11, color: 'white',
                      }}
                    >
                      SUS!
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        <Button variant="warning" fullWidth onClick={() => setPhase('voting')}>
          🗳️ Start Voting
        </Button>
      </div>
    </div>
  )
}
