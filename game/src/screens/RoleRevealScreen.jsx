import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import Button from '../components/Button'

export default function RoleRevealScreen() {
  const { myRole, crewPrompt, imposterPrompt, currentRound, totalRounds, setPhase } = useGameStore()
  const [flipped, setFlipped] = useState(false)
  const [ready, setReady] = useState(false)

  const isImposter = myRole === 'imposter'
  const prompt = isImposter ? imposterPrompt : crewPrompt

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), 800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (flipped) {
      const t = setTimeout(() => setReady(true), 600)
      return () => clearTimeout(t)
    }
  }, [flipped])

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px 120px', gap: 28,
    }}>
      {/* Round badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{
          background: 'rgba(255,255,255,0.08)', borderRadius: 30,
          padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 16, color: 'white' }}>Round {currentRound}</span>
        <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>of {totalRounds}</span>
        <div style={{ height: 14, width: 1, background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: totalRounds }, (_, i) => (
            <div key={i} style={{
              width: i < currentRound ? 16 : 6, height: 6, borderRadius: 3,
              background: i < currentRound ? '#58CC02' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </motion.div>

      {/* Card */}
      <div style={{ perspective: '1200px', width: 280, height: 320 }}>
        <motion.div
          animate={{ rotateY: flipped ? 0 : 180 }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <motion.div
            style={{
              position: 'absolute', inset: 0, borderRadius: 24,
              background: isImposter
                ? 'linear-gradient(145deg, #2D0808 0%, #1A0404 100%)'
                : 'linear-gradient(145deg, #0A2010 0%, #051008 100%)',
              border: isImposter ? '2px solid #FF4B4B50' : '2px solid #58CC0250',
              backfaceVisibility: 'hidden',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: 28, gap: 16,
              boxShadow: isImposter
                ? '0 20px 60px rgba(255,75,75,0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 20px 60px rgba(88,204,2,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              style={{ fontSize: 52 }}
            >
              {isImposter ? '☠️' : '🛡️'}
            </motion.div>

            <div style={{
              background: isImposter ? 'rgba(255,75,75,0.15)' : 'rgba(88,204,2,0.15)',
              border: isImposter ? '1.5px solid rgba(255,75,75,0.4)' : '1.5px solid rgba(88,204,2,0.4)',
              borderRadius: 12, padding: '6px 16px',
            }}>
              <span style={{
                fontFamily: 'Nunito', fontWeight: 900, fontSize: 14,
                color: isImposter ? '#FF6B6B' : '#58CC02',
                textTransform: 'uppercase', letterSpacing: 2,
              }}>
                {isImposter ? '☠️ Imposter' : '🗡️ Crew Member'}
              </span>
            </div>

            <p style={{
              fontFamily: 'Nunito', fontWeight: 800, fontSize: 16,
              color: 'white', textAlign: 'center', lineHeight: 1.5,
              margin: 0,
            }}>
              {prompt}
            </p>

            <p style={{
              fontFamily: 'Nunito', fontWeight: 600, fontSize: 12,
              color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0,
            }}>
              {isImposter ? '🤫 Blend in. You have a DIFFERENT prompt.' : '🤫 Keep your prompt SECRET'}
            </p>
          </motion.div>

          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 24,
            background: 'linear-gradient(145deg, #1e1e3a, #12122a)',
            border: '2px solid rgba(255,255,255,0.08)',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <motion.div
              animate={{ rotateY: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ fontSize: 52 }}
            >
              🃏
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Ready button */}
      <AnimatedButton show={ready} onClick={() => setPhase('submission')} />
    </div>
  )
}

function AnimatedButton({ show, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 20 }}
      style={{ width: '100%', maxWidth: 280 }}
    >
      <Button variant="primary" fullWidth onClick={onClick}>
        I'm Ready to Answer →
      </Button>
    </motion.div>
  )
}
