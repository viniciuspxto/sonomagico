import type { RitualStepType } from '@/types'

export interface RitualStepConfig {
  id: string
  stepNumber: number
  type: RitualStepType
  title: string
  subtitle: string
  emoji: string
}

export const RITUAL_STEPS: RitualStepConfig[] = [
  {
    id: 'environment',
    stepNumber: 1,
    type: 'environment',
    title: 'Preparacao do Ambiente',
    subtitle: 'Vamos preparar o espacinho magico',
    emoji: '🏠',
  },
  {
    id: 'alert-level',
    stepNumber: 2,
    type: 'alert-level',
    title: 'Nivel de Alerta',
    subtitle: 'Como esta o corpinho agora?',
    emoji: '🌡️',
  },
  {
    id: 'breathing',
    stepNumber: 3,
    type: 'breathing',
    title: 'Respiracao Guiada',
    subtitle: 'Respire com o Magicaco',
    emoji: '🌬️',
  },
  {
    id: 'gratitude',
    stepNumber: 4,
    type: 'gratitude',
    title: 'Coisas Boas do Dia',
    subtitle: 'O que te fez sorrir hoje?',
    emoji: '💛',
  },
  {
    id: 'story',
    stepNumber: 5,
    type: 'story',
    title: 'Historia da Noite',
    subtitle: 'Uma historia so pra voce',
    emoji: '📖',
  },
  {
    id: 'dream',
    stepNumber: 6,
    type: 'dream',
    title: 'Para Onde Vamos Sonhar',
    subtitle: 'Imagine um lugar especial',
    emoji: '⭐',
  },
  {
    id: 'final',
    stepNumber: 7,
    type: 'final',
    title: 'Momento Final',
    subtitle: 'Boa noite, dorminhoco!',
    emoji: '✨',
  },
]
