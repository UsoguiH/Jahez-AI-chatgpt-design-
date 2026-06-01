import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useGameStore, MOCK_PLAYERS } from '../store/gameStore'
import Button from '../components/Button'

function QRPlaceholder() {
  return (
    <div style={{
      width: 90, height: 90, borderRadius: 12,
      background: 'white', padding: 6, flexShrink: 0,
      display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1.5,
    }}>
      {Array.from({ length: 49 }, (_, i) => (
        <div key={i} style={{
          borderRadius: 1.5,
          background: Math.random() > 0.5 ? '#1A1A2E' : 'transparent',
        }} />
      ))}
    </div>
  )
}

export default function LobbyScreen() {
  const { roomCode, myName, setPhase } = useGameStore()
  const [view, setView] = useState('phone') // phone | display

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A2E', display: 'flex', flexDirection: 'column' }}>
      {/* Toggle */}
      <div style={{ padding: '16px 20px 0', display: 'flex', gap: 8, justifyContent: 'center' }}>
        {['phone', 'display'].map(v => (
          <motion.button
            key={v}
            onClick={() => setView(v)}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '8px 18px', borderRadius: 30, border: 'none', cursor: 'pointer',
              fontFamily: 'Nunito', fontWeight: 800, fontSize: 13,
              background: view === v ? '#58CC02' : 'rgba(255,255,255,0.08)',
              color: view === v ? 'white' : 'rgba(255,255,255,0.4)',
              boxShadow: view === v ? '0 3px 0 #46A302' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {v === 'phone' ? '📱 My Phone' : '📺 Shared Screen'}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'phone' ? (
          <motion.div key="phone"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 24px 120px', gap: 20 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 52 }}>🎉</div>
              <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 26, color: 'white', margin: '8px 0 4px' }}>You're in!</h2>
              <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 15, color: '#58CC02', margin: 0 }}>{myName}</p>
            </motion.div>

            <div style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '14px 20px',
              border: '1px solid rgba(255,255,255,0.08)', width: '100%',
            }}>
              <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1 }}>Players in Room</p>
              {MOCK_PLAYERS.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 22 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderBottom: i < MOCK_PLAYERS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: p.color + '30', border: `2px solid ${p.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Nunito', fontWeight: 900, fontSize: 13, color: p.color,
                  }}>
                    {p.name[0]}
                  </div>
                  <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: p.name === myName ? '#58CC02' : 'white', flex: 1 }}>
                    {p.name}{p.name === myName ? ' (you)' : ''}
                  </span>
                  {p.isHost && <span style={{ fontSize: 14 }}>👑</span>}
                </motion.div>
              ))}
            </div>

            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}
                />
              ))}
              <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Waiting for host to start...</span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="display"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 120px', gap: 16 }}
          >
            {/* Room Code */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ textAlign: 'center', width: '100%' }}
            >
              <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 2 }}>Join at findtheimposter.app</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                {roomCode.split('').map((char, i) => (
                  <motion.div key={i}
                    initial={{ scale: 0, rotateY: 90 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 18 }}
                    style={{
                      width: 42, height: 52, borderRadius: 12,
                      background: 'rgba(88,204,2,0.15)',
                      border: '2px solid #58CC0250',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Nunito', fontWeight: 900, fontSize: 24, color: '#58CC02',
                    }}
                  >
                    {char}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* QR + Share */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
              <QRPlaceholder />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Button variant="secondary" size="sm" onClick={() => {}}>📋 Copy Link</Button>
                <Button variant="dark" size="sm" onClick={() => {}}>📤 Share</Button>
              </div>
            </div>

            {/* Player grid */}
            <div style={{ width: '100%' }}>
              <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1 }}>
                {MOCK_PLAYERS.length} / 10 Players
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {MOCK_PLAYERS.map((p, i) => (
                  <motion.div key={p.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 18 }}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1.5px solid ${p.color}40`,
                      borderRadius: 12, padding: '10px 8px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: p.color + '25', border: `2px solid ${p.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Nunito', fontWeight: 900, fontSize: 15, color: p.color,
                    }}>
                      {p.name[0]}
                    </div>
                    <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 12, color: 'white' }}>{p.name}</span>
                    {p.isHost && <span style={{ fontSize: 10 }}>👑</span>}
                  </motion.div>
                ))}
              </div>
            </div>

            <Button variant="primary" fullWidth onClick={() => setPhase('role-reveal')}>▶ Start Game</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
