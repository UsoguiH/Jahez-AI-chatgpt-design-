import { motion } from 'framer-motion'
import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import Button from '../components/Button'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const up = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
}

export default function HomeScreen() {
  const [code, setCode] = useState('')
  const setPhase = useGameStore(s => s.setPhase)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1A1A2E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px 120px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      {[['#58CC02', '20%', '15%'], ['#1CB0F6', '80%', '70%'], ['#FF4B4B', '10%', '85%']].map(([c, x, y], i) => (
        <motion.div key={i}
          style={{
            position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
            width: 280, height: 280, left: x, top: y, transform: 'translate(-50%,-50%)',
            background: `radial-gradient(circle, ${c}0D 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4 + i * 1.5, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}

      <motion.div variants={stagger} initial="hidden" animate="show"
        style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>

        {/* Logo */}
        <motion.div variants={up} style={{ textAlign: 'center', marginBottom: 4 }}>
          <motion.div
            style={{ fontSize: 76, display: 'block', marginBottom: 10, filter: 'drop-shadow(0 8px 24px rgba(88,204,2,0.3))' }}
            animate={{ rotate: [0, -6, 6, -3, 3, 0], y: [0, -4, 0] }}
            transition={{ duration: 2.5, delay: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            🕵️
          </motion.div>
          <h1 style={{
            fontFamily: 'Nunito', fontWeight: 900, fontSize: 36,
            color: 'white', margin: 0, lineHeight: 1.1,
          }}>
            Find The
            <br />
            <span style={{ color: '#58CC02', textShadow: '0 0 30px #58CC0240' }}>Imposter</span>
          </h1>
          <p style={{
            fontFamily: 'Nunito', fontWeight: 600, fontSize: 13,
            color: 'rgba(255,255,255,0.35)', margin: '10px 0 0',
          }}>
            Party deduction game &bull; 4–10 players
          </p>
        </motion.div>

        {/* Create Room */}
        <motion.div variants={up} style={{ width: '100%' }}>
          <Button variant="primary" fullWidth onClick={() => setPhase('name-entry')}>
            🎮 Create Room
          </Button>
        </motion.div>

        {/* Divider */}
        <motion.div variants={up} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>or join with code</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </motion.div>

        {/* Join */}
        <motion.div variants={up} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="text" maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z2-9]/g, ''))}
            placeholder="A B C 1 2 3"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.07)',
              border: `2px solid ${code.length > 0 ? '#1CB0F6' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 16, padding: '15px 20px',
              color: 'white', fontFamily: 'Nunito', fontWeight: 900,
              fontSize: 24, textAlign: 'center', letterSpacing: 10,
              transition: 'border-color 0.2s',
            }}
          />
          <Button variant="secondary" fullWidth disabled={code.length !== 6} onClick={() => setPhase('name-entry')}>
            Join Room
          </Button>
        </motion.div>

        <motion.div variants={up}>
          <p style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.18)', textAlign: 'center', margin: 0 }}>
            No download &bull; No account &bull; Free to play
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
