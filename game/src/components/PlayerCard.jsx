import { motion } from 'framer-motion'

export default function PlayerCard({ name, answer, color = '#58CC02', revealed = false, hasAnswered = false, isSus = false, isImposter = false, small = false }) {
  const w = small ? 88 : 110
  const h = small ? 68 : 84

  return (
    <div style={{ perspective: '800px', width: w, height: h, flexShrink: 0 }}>
      <motion.div
        animate={{ rotateY: revealed ? 0 : 180 }}
        transition={{ duration: 0.55, ease: [0.215, 0.61, 0.355, 1] }}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            borderRadius: 14,
            background: isImposter ? 'linear-gradient(135deg, #3D0000, #1A0000)' : 'rgba(255,255,255,0.95)',
            backfaceVisibility: 'hidden',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            border: isSus ? '2.5px solid #FF4B4B' : isImposter ? '2px solid #FF4B4B' : `2px solid ${color}30`,
            boxShadow: isSus ? '0 0 16px #FF4B4B60' : isImposter ? '0 0 20px #FF4B4B80' : '0 4px 12px rgba(0,0,0,0.2)',
            gap: 3,
          }}
          animate={isSus ? { boxShadow: ['0 0 8px #FF4B4B40', '0 0 20px #FF4B4B80', '0 0 8px #FF4B4B40'] } : {}}
          transition={isSus ? { duration: 1.2, repeat: Infinity } : {}}
        >
          {isImposter && (
            <span style={{ fontSize: small ? 12 : 14, position: 'absolute', top: 4, right: 6 }}>☠️</span>
          )}
          <span style={{
            fontFamily: 'Nunito',
            fontWeight: 900,
            fontSize: small ? 17 : 22,
            color: isImposter ? '#FF6B6B' : color,
            lineHeight: 1,
          }}>
            {answer || '—'}
          </span>
          <span style={{
            fontFamily: 'Nunito',
            fontWeight: 700,
            fontSize: small ? 10 : 12,
            color: isImposter ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
            letterSpacing: 0.3,
          }}>
            {name}
          </span>
          {isSus && (
            <div style={{
              position: 'absolute', top: -8, right: -8,
              background: '#FF4B4B', borderRadius: '50%',
              width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 900, color: 'white',
            }}>!</div>
          )}
        </motion.div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.07)',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          border: '2px solid rgba(255,255,255,0.1)',
          gap: 4,
        }}>
          {hasAnswered ? (
            <>
              <span style={{ fontSize: small ? 16 : 20 }}>🔒</span>
              <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 10, color: '#58CC02' }}>Locked</span>
            </>
          ) : (
            <>
              <motion.span
                style={{ fontSize: small ? 16 : 20 }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >✍️</motion.span>
              <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{name}</span>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
