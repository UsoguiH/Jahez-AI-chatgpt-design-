import { motion } from 'framer-motion'
import { useGameStore, PHASES, PHASE_LABELS } from '../store/gameStore'

export default function DemoNav() {
  const { phase, nextPhase, prevPhase } = useGameStore()
  const idx = PHASES.indexOf(phase)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 50,
        padding: '8px 14px',
        zIndex: 9999,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <NavBtn onClick={prevPhase} disabled={idx === 0}>←</NavBtn>

      <div style={{ textAlign: 'center', minWidth: 110 }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, fontFamily: 'Nunito', letterSpacing: 1 }}>
          DEMO MODE
        </div>
        <div style={{ color: '#58CC02', fontSize: 13, fontWeight: 800, fontFamily: 'Nunito' }}>
          {PHASE_LABELS[phase]}
        </div>
        <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 4 }}>
          {PHASES.map((p, i) => (
            <div
              key={p}
              style={{
                width: i === idx ? 16 : 5,
                height: 5,
                borderRadius: 3,
                background: i === idx ? '#58CC02' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      <NavBtn onClick={nextPhase} disabled={idx === PHASES.length - 1}>→</NavBtn>
    </motion.div>
  )
}

function NavBtn({ children, onClick, disabled }) {
  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileTap={disabled ? {} : { scale: 0.9 }}
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: disabled ? 'rgba(255,255,255,0.05)' : 'rgba(88,204,2,0.2)',
        border: 'none',
        color: disabled ? 'rgba(255,255,255,0.2)' : '#58CC02',
        fontSize: 16,
        fontWeight: 900,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Nunito',
      }}
    >
      {children}
    </motion.button>
  )
}
