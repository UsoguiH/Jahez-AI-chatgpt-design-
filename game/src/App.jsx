import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './store/gameStore'
import HomeScreen from './screens/HomeScreen'
import NameEntryScreen from './screens/NameEntryScreen'
import LobbyScreen from './screens/LobbyScreen'
import RoleRevealScreen from './screens/RoleRevealScreen'
import SubmissionScreen from './screens/SubmissionScreen'
import RevealScreen from './screens/RevealScreen'
import DebateScreen from './screens/DebateScreen'
import VotingScreen from './screens/VotingScreen'
import RoundResultScreen from './screens/RoundResultScreen'
import FinalScoreScreen from './screens/FinalScoreScreen'
import DemoNav from './components/DemoNav'

const SCREENS = {
  'home': HomeScreen,
  'name-entry': NameEntryScreen,
  'lobby': LobbyScreen,
  'role-reveal': RoleRevealScreen,
  'submission': SubmissionScreen,
  'submission-locked': SubmissionScreen,
  'reveal': RevealScreen,
  'debate': DebateScreen,
  'voting': VotingScreen,
  'voting-done': VotingScreen,
  'round-result': RoundResultScreen,
  'final-score': FinalScoreScreen,
}

export default function App() {
  const phase = useGameStore(s => s.phase)
  const Screen = SCREENS[phase] || HomeScreen

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #1e1e40 0%, #0f0f1f 60%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
    }}>
      {/* Phone Frame */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 390,
        height: '100vh',
        overflow: 'hidden',
        background: '#1A1A2E',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 40px 80px rgba(0,0,0,0.7)',
      }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}
          >
            <Screen />
          </motion.div>
        </AnimatePresence>
      </div>

      <DemoNav />
    </div>
  )
}
