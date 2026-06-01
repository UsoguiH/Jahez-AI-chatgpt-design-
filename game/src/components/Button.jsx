import { motion } from 'framer-motion'

const VARIANTS = {
  primary:   { bg: '#58CC02', shadow: '#46A302', text: '#fff' },
  danger:    { bg: '#FF4B4B', shadow: '#C23B3B', text: '#fff' },
  secondary: { bg: '#1CB0F6', shadow: '#1490CC', text: '#fff' },
  ghost:     { bg: 'transparent', shadow: 'transparent', text: '#1CB0F6', border: '2.5px solid #1CB0F6' },
  dark:      { bg: 'rgba(255,255,255,0.1)', shadow: 'rgba(0,0,0,0.3)', text: '#fff' },
  warning:   { bg: '#FF9600', shadow: '#CC7800', text: '#fff' },
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  fullWidth = false,
  size = 'lg',
  style = {},
}) {
  const v = VARIANTS[variant] || VARIANTS.primary
  const height = size === 'sm' ? 44 : size === 'md' ? 50 : 58
  const fontSize = size === 'sm' ? 15 : size === 'md' ? 16 : 18
  const radius = size === 'sm' ? 14 : 20

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileTap={disabled ? {} : { y: 4, boxShadow: `0 0px 0 ${v.shadow}` }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: disabled ? 'rgba(255,255,255,0.12)' : v.bg,
        boxShadow: disabled ? '0 4px 0 rgba(0,0,0,0.2)' : `0 4px 0 ${v.shadow}`,
        color: disabled ? 'rgba(255,255,255,0.4)' : v.text,
        border: v.border || 'none',
        borderRadius: radius,
        height,
        width: fullWidth ? '100%' : 'auto',
        padding: '0 24px',
        fontSize,
        fontWeight: 800,
        fontFamily: 'Nunito',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        ...style,
      }}
    >
      {children}
    </motion.button>
  )
}
