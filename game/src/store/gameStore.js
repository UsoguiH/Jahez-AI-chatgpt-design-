import { create } from 'zustand'

export const PHASES = [
  'home',
  'name-entry',
  'lobby',
  'role-reveal',
  'submission',
  'submission-locked',
  'reveal',
  'debate',
  'voting',
  'voting-done',
  'round-result',
  'final-score',
]

export const PHASE_LABELS = {
  'home': 'Home',
  'name-entry': 'Name Entry',
  'lobby': 'Lobby',
  'role-reveal': 'Role Reveal',
  'submission': 'Submission',
  'submission-locked': 'Locked In',
  'reveal': 'Reveal',
  'debate': 'Debate',
  'voting': 'Voting',
  'voting-done': 'Vote Cast',
  'round-result': 'Round Result',
  'final-score': 'Final Score',
}

export const MOCK_PLAYERS = [
  { id: '1', name: 'Sara',   score: 3, delta: 1, rank: 1, isHost: true,  color: '#FF6B6B' },
  { id: '2', name: 'Khalid', score: 2, delta: 0, rank: 2, isHost: false, color: '#4ECDC4' },
  { id: '3', name: 'Adel',   score: 2, delta: 1, rank: 3, isHost: false, color: '#45B7D1' },
  { id: '4', name: 'Noor',   score: 2, delta: 1, rank: 4, isHost: false, color: '#96E6A1' },
  { id: '5', name: 'Omar',   score: 1, delta: 1, rank: 5, isHost: false, color: '#DDA0DD' },
  { id: '6', name: 'Jess',   score: 1, delta: 0, rank: 6, isHost: false, color: '#F0E68C' },
]

export const MOCK_ANSWERS = [
  { playerId: '1', name: 'Sara',   answer: '7',  locked: true, color: '#FF6B6B' },
  { playerId: '2', name: 'Khalid', answer: '12', locked: true, color: '#4ECDC4' },
  { playerId: '3', name: 'Adel',   answer: '8',  locked: true, color: '#45B7D1' },
  { playerId: '4', name: 'Noor',   answer: '6',  locked: true, color: '#96E6A1' },
  { playerId: '5', name: 'Omar',   answer: '7',  locked: true, color: '#DDA0DD' },
  { playerId: '6', name: 'Jess',   answer: '—', locked: true, color: '#F0E68C' },
]

export const useGameStore = create((set, get) => ({
  phase: 'home',
  view: 'phone',
  myName: 'Adel',
  myRole: 'crew',
  myAnswer: '',
  isAnswerLocked: false,
  myVote: null,
  isVoteCast: false,
  susMarks: [],
  players: MOCK_PLAYERS,
  answers: MOCK_ANSWERS,
  currentRound: 1,
  totalRounds: 7,
  roomCode: 'ZXKR47',
  crewPrompt: 'How many hours of sleep do you get per night?',
  imposterPrompt: 'How many cups of coffee do you drink per day?',
  imposterRevealId: '2',
  roundResult: 'CREW_WIN',

  setPhase: (phase) => set({ phase }),
  setView: (view) => set({ view }),
  setMyName: (name) => set({ myName: name }),
  setMyAnswer: (answer) => set({ myAnswer: answer }),
  lockAnswer: () => set({ isAnswerLocked: true, phase: 'submission-locked' }),
  castVote: (id) => set({ myVote: id, isVoteCast: true, phase: 'voting-done' }),
  toggleSus: (id) => set(s => ({
    susMarks: s.susMarks.includes(id)
      ? s.susMarks.filter(x => x !== id)
      : [...s.susMarks, id],
  })),
  nextPhase: () => {
    const { phase } = get()
    const idx = PHASES.indexOf(phase)
    if (idx < PHASES.length - 1) set({ phase: PHASES[idx + 1] })
  },
  prevPhase: () => {
    const { phase } = get()
    const idx = PHASES.indexOf(phase)
    if (idx > 0) set({ phase: PHASES[idx - 1] })
  },
  reset: () => set({
    phase: 'home', view: 'phone', myAnswer: '',
    isAnswerLocked: false, myVote: null, isVoteCast: false, susMarks: [],
  }),
}))
