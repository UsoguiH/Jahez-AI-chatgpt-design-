import { motion } from 'framer-motion'
import { useState } from 'react'
import { useGameStore, MOCK_ANSWERS } from '../store/gameStore'
import PlayerCard from '../components/PlayerCard'
import Button from '../components/Button'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.3 },
  },
}
const cardVariant = {
  hidden: { rotateY: 90, opacity: 0, scale: 0.9 },
  show: {
    rotateY: 0, opacity: 1, scale: 1,
    transition: { duration: 0.45, ease: [0.215, 0.61, 0.355, 1] },
  },
}

export default function RevealScreen() {
  const { setPhase } = useGameStore()
  const [revealed, setRevealed] = useState(false)

  const handleReveal = () => setRevealed(true)

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '32px 20px 120px', gap: 24,
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center' }}
      >
        <motion.div
          animate={revealed ? { scale: [1, 1.15, 1] } : { opacity: [1, 0.6, 1] }}
          transition={{ duration: revealed ? 0.4 : 1.5, repeat: revealed ? 0 : Infinity }}
          style={{ fontSize: 40, marginBottom: 8 }}
        >
          {revealed ? '👀' : '🎭'}
        </motion.div>
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 26, color: 'white', margin: 0 }}>
          {revealed ? 'All Answers Revealed!' : 'Revealing Answers...'}
        </h2>
        <p style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: '6px 0 0' }}>
          {revealed ? 'Who gave a suspicious answer?' : 'Flip the cards to see what everyone said'}
        </p>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={revealed ? 'show' : 'hidden'}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', width: '100%', perspective: '1000px' }}
      >
        {MOCK_ANSWERS.map((a) => (
          <motion.div key={a.playerId} variants={cardVariant} style={{ perspective: '600px' }}>
            <PlayerCard
              name={a.name}
              answer={a.answer}
              color={a.color}
              revealed={revealed}
              hasAnswered={true}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Reveal or proceed */}
      {!revealed ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ width: '100%', maxWidth: 320 }}
        >
          <motion.button
            onClick={handleReveal}
            whileTap={{ scale: 0.96, y: 4 }}
            animate={{
              boxShadow: ['0 4px 0 #46A302', '0 4px 20px #58CC0280', '0 4px 0 #46A302'],
            }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              width: '100%', height: 58, borderRadius: 20,
              background: '#58CC02', border: 'none',
              fontFamily: 'Nunito', fontWeight: 900, fontSize: 18,
              color: 'white', cursor: 'pointer',
            }}
          >
            🎭 Flip All Cards!
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ width: '100%', maxWidth: 320 }}
        >
          <Button variant="warning" fullWidth onClick={() => setPhase('debate')}>
            💬 Start Debate Timer
          </Button>
        </motion.div>
      )}
    </div>
  )
}
