import { useMemo, useState } from 'react'
import {
  MUSIC_SPEED_OPTIONS,
  MUSIC_TONE_OPTIONS,
  MUSIC_VOLUME_OPTIONS,
  musicDemoClips,
  musicPracticeClips,
} from '../data/musicClips'
import type { EmotionLabel } from '../data/scenes'
import type {
  MusicAnswer,
  MusicClip,
  MusicFeatureLevel,
  ToneLevel,
  VolumeLevel,
} from '../data/musicClips'
import MusicResult from './MusicResult'

type MusicStage = 'intro' | 'demo' | 'practice' | 'result'
type FeedbackKind = 'correct' | 'wrong' | 'skip'

interface PracticeFeedback {
  kind: FeedbackKind
  message: string
}

const MUSIC_EMOTION_OPTIONS: EmotionLabel[] = ['开心', '难过', '害怕', '放松']

function getPracticeFeedback(clip: MusicClip, isCorrect: boolean): PracticeFeedback {
  if (isCorrect) {
    return {
      kind: 'correct',
      message: `判断正确！这段音乐更接近“${clip.correctEmotion}”，你抓住了关键线索。`,
    }
  }

  return {
    kind: 'wrong',
    message: `这段音乐更接近“${clip.correctEmotion}”。可以重点听速度（${clip.expectedSpeed}）、音量（${clip.expectedVolume}）和音色（${clip.expectedTone}）。`,
  }
}

export default function MusicView() {
  const [stage, setStage] = useState<MusicStage>('intro')
  const [demoIndex, setDemoIndex] = useState(0)
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [answers, setAnswers] = useState<MusicAnswer[]>([])
  const [chosenEmotion, setChosenEmotion] = useState<EmotionLabel | null>(null)
  const [speed, setSpeed] = useState<MusicFeatureLevel>('中')
  const [volume, setVolume] = useState<VolumeLevel>('中')
  const [tone, setTone] = useState<ToneLevel>('中性')
  const [reasonText, setReasonText] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null)
  const [audioErrors, setAudioErrors] = useState<Record<string, boolean>>({})

  const currentDemoClip = musicDemoClips[demoIndex]
  const currentPracticeClip = musicPracticeClips[practiceIndex]

  const progressText = useMemo(() => {
    if (stage === 'demo') {
      return `示范 ${Math.min(demoIndex + 1, musicDemoClips.length)}/${musicDemoClips.length}`
    }
    if (stage === 'practice') {
      return `练习 ${Math.min(practiceIndex + 1, musicPracticeClips.length)}/${musicPracticeClips.length}`
    }
    if (stage === 'result') {
      return `练习完成 ${musicPracticeClips.length}/${musicPracticeClips.length}`
    }
    return '活动说明'
  }, [demoIndex, practiceIndex, stage])

  const markAudioError = (clipId: string): void => {
    setAudioErrors((prev) => ({ ...prev, [clipId]: true }))
  }

  const resetPracticeForm = (): void => {
    setChosenEmotion(null)
    setSpeed('中')
    setVolume('中')
    setTone('中性')
    setReasonText('')
    setSubmitError(null)
    setFeedback(null)
  }

  const handleStart = (): void => {
    setStage('demo')
  }

  const handleNextDemo = (): void => {
    if (demoIndex === musicDemoClips.length - 1) {
      setStage('practice')
      return
    }
    setDemoIndex((prev) => prev + 1)
  }

  const handleSubmitPractice = (): void => {
    if (!currentPracticeClip || feedback) {
      return
    }
    if (!chosenEmotion) {
      setSubmitError('请先选择你判断的情绪。')
      return
    }

    const isCorrect = chosenEmotion === currentPracticeClip.correctEmotion
    const answer: MusicAnswer = {
      clipId: currentPracticeClip.id,
      chosenEmotion,
      speed,
      volume,
      tone,
      reasonText: reasonText.trim(),
      isEmotionCorrect: isCorrect,
    }

    setAnswers((prev) => [...prev, answer])
    setFeedback(getPracticeFeedback(currentPracticeClip, isCorrect))
    setSubmitError(null)
  }

  const handleSkipPractice = (): void => {
    if (!currentPracticeClip || feedback) {
      return
    }

    const skippedAnswer: MusicAnswer = {
      clipId: currentPracticeClip.id,
      chosenEmotion: currentPracticeClip.correctEmotion,
      speed,
      volume,
      tone,
      reasonText: reasonText.trim() || '音频加载失败，已跳过本题。',
      isEmotionCorrect: false,
      isSkipped: true,
    }

    setAnswers((prev) => [...prev, skippedAnswer])
    setFeedback({
      kind: 'skip',
      message: '本题已跳过。你可以在结果页查看正确情绪和推荐线索。',
    })
    setSubmitError(null)
  }

  const handleNextPractice = (): void => {
    if (!feedback) {
      return
    }

    if (practiceIndex === musicPracticeClips.length - 1) {
      setStage('result')
      return
    }

    setPracticeIndex((prev) => prev + 1)
    resetPracticeForm()
  }

  const handleRestart = (): void => {
    setStage('intro')
    setDemoIndex(0)
    setPracticeIndex(0)
    setAnswers([])
    resetPracticeForm()
    setAudioErrors({})
  }

  if (stage === 'result') {
    return (
      <MusicResult clips={musicPracticeClips} answers={answers} onRestart={handleRestart} />
    )
  }

  return (
    <div className="music-layout">
      <h2>音乐情绪识别（8-10分钟）</h2>
      <p className="subtle-text">
        通过音乐判断情绪，重点关注速度、音量和音色三个线索。
      </p>
      <p className="music-stage-pill">{progressText}</p>

      {stage === 'intro' && (
        <section className="music-card">
          <h3>活动流程</h3>
          <ol className="music-intro-list">
            <li>先听 2 段教师示范音乐，学习如何匹配情绪卡。</li>
            <li>
              再完成 {musicPracticeClips.length} 段学生练习，每段判断情绪并说明线索。
            </li>
            <li>完成后查看得分与 AI 总结建议。</li>
          </ol>
          <p className="subtle-text">
            老师将引导你重点听：速度（快慢）、音量（大小）、音色（明亮或低沉）。
          </p>
          <button type="button" className="primary-btn" onClick={handleStart}>
            开始音乐活动
          </button>
        </section>
      )}

      {stage === 'demo' && currentDemoClip && (
        <section className="music-card">
          <h3>{currentDemoClip.title}</h3>
          <audio
            controls
            preload="metadata"
            src={currentDemoClip.audioUrl}
            className="music-audio"
            onError={() => markAudioError(currentDemoClip.id)}
          >
            你的浏览器暂不支持音频播放。
          </audio>

          {audioErrors[currentDemoClip.id] && (
            <p className="music-audio-error">
              音频加载失败，请检查 {currentDemoClip.audioUrl} 文件是否存在。
            </p>
          )}

          <p className="music-emotion-card">示范情绪卡：{currentDemoClip.correctEmotion}</p>
          <div className="music-feature-tags">
            <span className="music-feature-tag">速度：{currentDemoClip.expectedSpeed}</span>
            <span className="music-feature-tag">音量：{currentDemoClip.expectedVolume}</span>
            <span className="music-feature-tag">音色：{currentDemoClip.expectedTone}</span>
          </div>
          <p>{currentDemoClip.teacherModelExplanation}</p>

          <button type="button" className="primary-btn" onClick={handleNextDemo}>
            {demoIndex === musicDemoClips.length - 1 ? '进入学生练习' : '下一段示范'}
          </button>
        </section>
      )}

      {stage === 'practice' && currentPracticeClip && (
        <section className="music-card">
          <h3>{currentPracticeClip.title}</h3>
          <audio
            controls
            preload="metadata"
            src={currentPracticeClip.audioUrl}
            className="music-audio"
            onError={() => markAudioError(currentPracticeClip.id)}
          >
            你的浏览器暂不支持音频播放。
          </audio>

          {audioErrors[currentPracticeClip.id] && (
            <div className="music-audio-error-wrap">
              <p className="music-audio-error">
                音频加载失败，请检查 {currentPracticeClip.audioUrl} 文件是否存在。
              </p>
              {!feedback && (
                <button type="button" className="secondary-btn" onClick={handleSkipPractice}>
                  跳过此题
                </button>
              )}
            </div>
          )}

          <div className="music-option-group">
            <p className="music-label">1) 你判断的情绪</p>
            <div className="music-option-grid">
              {MUSIC_EMOTION_OPTIONS.map((emotion) => (
                <button
                  key={emotion}
                  type="button"
                  className={`music-option-btn ${chosenEmotion === emotion ? 'active' : ''}`}
                  onClick={() => setChosenEmotion(emotion)}
                  disabled={Boolean(feedback)}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          <div className="music-option-group">
            <p className="music-label">2) 你听到的音乐线索</p>
            <div className="music-feature-row">
              <span className="music-feature-label">速度</span>
              <div className="music-feature-options">
                {MUSIC_SPEED_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`music-option-btn ${speed === item ? 'active' : ''}`}
                    onClick={() => setSpeed(item)}
                    disabled={Boolean(feedback)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="music-feature-row">
              <span className="music-feature-label">音量</span>
              <div className="music-feature-options">
                {MUSIC_VOLUME_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`music-option-btn ${volume === item ? 'active' : ''}`}
                    onClick={() => setVolume(item)}
                    disabled={Boolean(feedback)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="music-feature-row">
              <span className="music-feature-label">音色</span>
              <div className="music-feature-options">
                {MUSIC_TONE_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`music-option-btn ${tone === item ? 'active' : ''}`}
                    onClick={() => setTone(item)}
                    disabled={Boolean(feedback)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="music-option-group">
            <p className="music-label">3) 简短说明（可选）</p>
            <textarea
              className="music-reason-textarea"
              rows={3}
              value={reasonText}
              onChange={(event) => setReasonText(event.target.value)}
              disabled={Boolean(feedback)}
              placeholder="例如：这段音乐很慢、声音轻，所以我觉得是难过。"
            />
          </div>

          {submitError && <p className="error-text">{submitError}</p>}

          {!feedback && (
            <button type="button" className="primary-btn" onClick={handleSubmitPractice}>
              提交本题
            </button>
          )}

          {feedback && (
            <div className={`music-feedback ${feedback.kind}`}>
              <p>{feedback.message}</p>
              <button type="button" className="primary-btn" onClick={handleNextPractice}>
                {practiceIndex === musicPracticeClips.length - 1 ? '查看结果' : '下一题'}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
