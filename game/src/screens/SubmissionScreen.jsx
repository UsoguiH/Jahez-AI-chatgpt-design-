import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, MOCK_ANSWERS } from '../store/gameStore'
import Button from '../components/Button'
import CountdownRing from '../components/CountdownRing'

export default function SubmissionScreen() {
  const { myAnswer, setMyAnswer, isAnswerLocked, lockAnswer, crewPrompt, myRole } = useGameStore()
  const lockedCount = MOCK_ANSWERS.filter((_, i) => i < 4).length
  const totalPlayers = MOCK_ANSWERS.length

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 24px 120px',
      gap: 20,
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div>
          <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>Round 1 of 7</p>
          <p style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'white', margin: '2px 0 0' }}>{lockedCount}/{totalPlayers} locked in</p>
        </div>
        <CountdownRing total={60} remaining={42} size={64} strokeWidth={7} />
      </motion.div>

      {/* Player lock indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}
      >
        {MOCK_ANSWERS.map((a, i) => (
          <motion.div key={a.playerId}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 18 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: i < 4 ? a.color + '25' : 'rgba(255,255,255,0.07)',
              border: `2px solid ${i < 4 ? a.color : 'rgba(255,255,255,0.12)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: i < 4 ? 16 : 14,
            }}>
              {i < 4 ? '🔒' : (
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  ✍️
                </motion.span>
              )}
            </div>
            <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 10, color: i < 4 ? a.color : 'rgba(255,255,255,0.25)' }}>
              {a.name}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Prompt reminder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{
          width: '100%', background: 'rgba(88,204,2,0.08)',
          border: '1.5px solid rgba(88,204,2,0.2)',
          borderRadius: 16, padding: '12px 16px',
        }}
      >
        <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: '#58CC02', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>Your prompt</p>
        <p style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: 'white', margin: 0 }}>{crewPrompt}</p>
      </motion.div>

      {/* Input + Lock */}
      <AnimatePresence mode="wait">
        {!isAnswerLocked ? (
          <motion.div key="input"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <div style={{ position: 'relative' }}>
              <motion.input
                type="text" maxLength={12}
                value={myAnswer}
                onChange={e => setMyAnswer(e.target.value.replace(/\s/g, ''))}
                placeholder="Type your answer..."
                autoFocus
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.07)',
                  border: `2.5px solid ${myAnswer.length > 0 ? '#58CC02' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: 18, padding: '20px 22px',
                  color: 'white', fontFamily: 'Nunito', fontWeight: 900,
                  fontSize: 28, textAlign: 'center',
                  transition: 'border-color 0.2s',
                }}
              />
              {myAnswer.length > 8 && (
                <span style={{
                  position: 'absolute', right: 14, bottom: 8,
                  fontFamily: 'Nunito', fontWeight: 700, fontSize: 11,
                  color: myAnswer.length >= 12 ? '#FF4B4B' : 'rgba(255,255,255,0.3)',
                }}>
                  {myAnswer.length}/12
                </span>
              )}
            </div>
            <Button variant="primary" fullWidth disabled={myAnswer.trim().length === 0} onClick={lockAnswer}>
              🔒 Lock In My Answer
            </Button>
            <p style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', margin: 0 }}>
              One word or number only &bull; No spaces
            </p>
          </motion.div>
        ) : (
          <motion.div key="locked"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
            style={{
              width: '100%', background: 'rgba(88,204,2,0.1)',
              border: '2px solid rgba(88,204,2,0.4)',
              borderRadius: 20, padding: '24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              style={{ fontSize: 40 }}
            >
              ✅
            </motion.div>
            <p style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 20, color: '#58CC02', margin: 0 }}>
              "{myAnswer}" locked in!
            </p>
            <p style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Waiting for others...
            </p>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {[0,1,2].map(i => (
                <motion.div key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#58CC0260' }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
