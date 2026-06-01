import { motion } from 'framer-motion'
import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import Button from '../components/Button'

export default function NameEntryScreen() {
  const { myName, setMyName, setPhase } = useGameStore()
  const [val, setVal] = useState(myName)
  const [focused, setFocused] = useState(false)

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px 120px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}
      >
        {/* Back */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setPhase('home')}
          style={{
            alignSelf: 'flex-start',
            background: 'rgba(255,255,255,0.08)', borderRadius: 12,
            padding: '8px 16px', color: 'rgba(255,255,255,0.6)',
            fontFamily: 'Nunito', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
          }}
        >
          ← Back
        </motion.button>

        {/* Emoji */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 64 }}
        >
          👤
        </motion.div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: 'white', margin: 0 }}>
            What's your name?
          </h2>
          <p style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: '8px 0 0' }}>
            Other players will see this
          </p>
        </div>

        <motion.input
          type="text" maxLength={16}
          value={val}
          onChange={e => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Your nickname..."
          autoFocus
          animate={{ borderColor: focused ? '#58CC02' : val.length > 0 ? '#58CC0280' : 'rgba(255,255,255,0.12)' }}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.07)',
            border: '2.5px solid rgba(255,255,255,0.12)',
            borderRadius: 18, padding: '18px 22px',
            color: 'white', fontFamily: 'Nunito', fontWeight: 800,
            fontSize: 22, textAlign: 'center',
          }}
        />

        {val.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: '100%' }}
          >
            <Button
              variant="primary" fullWidth
              onClick={() => { setMyName(val.trim()); setPhase('lobby') }}
            >
              Let's Play →
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
