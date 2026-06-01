import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, MOCK_ANSWERS } from '../store/gameStore'
import Button from '../components/Button'
import CountdownRing from '../components/CountdownRing'

export default function VotingScreen() {
  const { myVote, isVoteCast, castVote } = useGameStore()

  if (isVoteCast) return <VoteCastScreen />;

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '28px 20px 120px', gap: 20,
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ textAlign: 'center', width: '100%' }}
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
          style={{ fontSize: 44, marginBottom: 8 }}
        >
          🗳️
        </motion.div>
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: 'white', margin: 0 }}>Vote Now!</h2>
        <p style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '6px 0 0' }}>Who is the Imposter?</p>
      </motion.div>

      {/* Timer */}
      <CountdownRing total={30} remaining={22} size={72} strokeWidth={7} />

      {/* Ballot */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {MOCK_ANSWERS.filter(a => a.name !== 'Adel').map((a, i) => {
          const selected = myVote === a.playerId
          return (
            <motion.button
              key={a.playerId}
              onClick={() => !isVoteCast && useGameStore.getState().setMyVote ? useGameStore.getState().setMyAnswer(a.playerId) : null}
              onPointerDown={() => { if (!isVoteCast) useGameStore.setState({ myVote: a.playerId }) }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 22 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: selected ? 'rgba(88,204,2,0.15)' : 'rgba(255,255,255,0.05)',
                border: selected ? '2.5px solid #58CC02' : '1.5px solid rgba(255,255,255,0.1)',
                borderRadius: 16, padding: '14px 16px',
                cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'all 0.2s',
                boxShadow: selected ? '0 0 20px rgba(88,204,2,0.2)' : 'none',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                background: a.color + '25', border: `2px solid ${a.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Nunito', fontWeight: 900, fontSize: 16, color: a.color,
              }}>
                {a.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'white' }}>{a.name}</div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Answered: {a.answer}</div>
              </div>
              {selected ? (
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: '#58CC02',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15,
                  }}
                >
                  ✓
                </motion.div>
              ) : (
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.2)',
                }} />
              )}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {myVote && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: '100%' }}
          >
            <Button variant="danger" fullWidth onClick={() => castVote(myVote)}>
              Cast My Vote!
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function VoteCastScreen() {
  const { setPhase } = useGameStore()
  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px',
    }}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
      >
        <div style={{ fontSize: 72 }}>🗳️</div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: '#58CC02', margin: 0 }}>Vote Cast!</h2>
        </motion.div>
        <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Waiting for others to vote...</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {[0,1,2].map(i => (
            <motion.div key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.25 }}
              style={{ width: 10, height: 10, borderRadius: '50%', background: '#58CC0260' }}
            />
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} style={{ marginTop: 16 }}>
          <Button variant="primary" onClick={() => setPhase('round-result')}>See Results →</Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
