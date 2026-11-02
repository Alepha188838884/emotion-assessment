import type { EmotionLabel } from './scenes'

export type MusicFeatureLevel = '快' | '中' | '慢'
export type VolumeLevel = '大' | '中' | '小'
export type ToneLevel = '明亮' | '中性' | '低沉'
export type MusicPhase = 'demo' | 'practice'

export interface MusicClip {
  id: string
  title: string
  audioUrl: string
  phase: MusicPhase
  correctEmotion: EmotionLabel
  expectedSpeed: MusicFeatureLevel
  expectedVolume: VolumeLevel
  expectedTone: ToneLevel
  teacherModelExplanation: string
}

export interface MusicAnswer {
  clipId: string
  chosenEmotion: EmotionLabel
  speed: MusicFeatureLevel
  volume: VolumeLevel
  tone: ToneLevel
  reasonText: string
  isEmotionCorrect: boolean
  isSkipped?: boolean
}

export const MUSIC_SPEED_OPTIONS: MusicFeatureLevel[] = ['快', '中', '慢']
export const MUSIC_VOLUME_OPTIONS: VolumeLevel[] = ['大', '中', '小']
export const MUSIC_TONE_OPTIONS: ToneLevel[] = ['明亮', '中性', '低沉']

export const musicDemoClips: MusicClip[] = [
  {
    id: 'demo-1',
    title: '示范片段 1：欢快节奏',
    audioUrl: '/audio/开心.mp3',
    phase: 'demo',
    correctEmotion: '开心',
    expectedSpeed: '快',
    expectedVolume: '中',
    expectedTone: '明亮',
    teacherModelExplanation:
      '这段音乐速度偏快，音色明亮，听起来轻松有活力，所以更像“开心”。',
  },
  {
    id: 'demo-2',
    title: '示范片段 2：慢速旋律',
    audioUrl: '/audio/难过.mp3',
    phase: 'demo',
    correctEmotion: '难过',
    expectedSpeed: '慢',
    expectedVolume: '小',
    expectedTone: '低沉',
    teacherModelExplanation:
      '这段音乐速度慢、音量小，音色偏低沉，给人的感觉更像“难过”。',
  },
]

export const musicPracticeClips: MusicClip[] = [
  {
    id: 'practice-1',
    title: '练习片段 1',
    audioUrl: '/audio/开心.mp3',
    phase: 'practice',
    correctEmotion: '开心',
    expectedSpeed: '快',
    expectedVolume: '中',
    expectedTone: '明亮',
    teacherModelExplanation:
      '节奏比较快，音色亮，通常会让人联想到积极和轻快。',
  },
  {
    id: 'practice-2',
    title: '练习片段 2',
    audioUrl: '/audio/难过.mp3',
    phase: 'practice',
    correctEmotion: '难过',
    expectedSpeed: '慢',
    expectedVolume: '小',
    expectedTone: '低沉',
    teacherModelExplanation:
      '节奏偏慢，力度柔弱，音色偏低，通常更接近难过情绪。',
  },
  {
    id: 'practice-3',
    title: '练习片段 3',
    audioUrl: '/audio/害怕.mp3',
    phase: 'practice',
    correctEmotion: '害怕',
    expectedSpeed: '中',
    expectedVolume: '小',
    expectedTone: '低沉',
    teacherModelExplanation:
      '音色偏暗，音量不大但有不安感，常与害怕情绪有关。',
  },
  {
    id: 'practice-4',
    title: '练习片段 4',
    audioUrl: '/audio/放松.mp3',
    phase: 'practice',
    correctEmotion: '放松',
    expectedSpeed: '慢',
    expectedVolume: '小',
    expectedTone: '明亮',
    teacherModelExplanation:
      '节奏慢、音量轻，整体柔和稳定，通常让人感觉放松。',
  },
]
