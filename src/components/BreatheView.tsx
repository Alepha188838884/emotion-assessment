import { useEffect, useMemo, useState } from 'react'

interface BreathStep {
  label: string
  seconds: number
  hint: string
}

interface BreathPattern {
  id: string
  name: string
  description: string
  steps: BreathStep[]
}

const BREATH_PATTERNS: BreathPattern[] = [
  {
    id: 'box',
    name: '方块呼吸',
    description: '吸气 4 秒，停 4 秒，呼气 4 秒，停 4 秒。',
    steps: [
      { label: '吸气', seconds: 4, hint: '鼻子慢慢吸气。' },
      { label: '停住', seconds: 4, hint: '肩膀放松，不要耸肩。' },
      { label: '呼气', seconds: 4, hint: '像吹羽毛一样慢慢呼气。' },
      { label: '停一下', seconds: 4, hint: '等身体安静下来。' },
    ],
  },
  {
    id: 'calm',
    name: '平静呼吸',
    description: '吸气 4 秒，呼气 6 秒，适合情绪比较激动时。',
    steps: [
      { label: '吸气', seconds: 4, hint: '轻轻吸气，让肚子鼓起来。' },
      { label: '呼气', seconds: 6, hint: '慢慢吐气，把紧张一起呼出去。' },
    ],
  },
  {
    id: 'sleepy',
    name: '慢慢放松',
    description: '吸气 3 秒，停 2 秒，呼气 5 秒，适合睡前或想安静时。',
    steps: [
      { label: '吸气', seconds: 3, hint: '慢慢吸气，让身体准备放松。' },
      { label: '停住', seconds: 2, hint: '保持安静，不用着急。' },
      { label: '呼气', seconds: 5, hint: '呼得更长一点，肩膀放下来。' },
    ],
  },
]

const DURATION_OPTIONS = [60, 120, 180]

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getCurrentStep(pattern: BreathPattern, elapsedSeconds: number): {
  step: BreathStep
  remainingInStep: number
} {
  const cycleLength = pattern.steps.reduce((sum, step) => sum + step.seconds, 0)
  const cyclePosition = cycleLength === 0 ? 0 : elapsedSeconds % cycleLength

  let passedSeconds = 0
  for (const step of pattern.steps) {
    const stepEnd = passedSeconds + step.seconds
    if (cyclePosition < stepEnd) {
      return {
        step,
        remainingInStep: stepEnd - cyclePosition,
      }
    }
    passedSeconds = stepEnd
  }

  const fallbackStep = pattern.steps[pattern.steps.length - 1]
  return {
    step: fallbackStep,
    remainingInStep: fallbackStep.seconds,
  }
}

export default function BreatheView() {
  const [selectedPatternId, setSelectedPatternId] = useState(BREATH_PATTERNS[0].id)
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[1])
  const [remainingSeconds, setRemainingSeconds] = useState(DURATION_OPTIONS[1])
  const [isRunning, setIsRunning] = useState(false)

  const currentPattern =
    BREATH_PATTERNS.find((pattern) => pattern.id === selectedPatternId) ?? BREATH_PATTERNS[0]

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [isRunning])

  useEffect(() => {
    if (remainingSeconds === 0 && isRunning) {
      setIsRunning(false)
    }
  }, [isRunning, remainingSeconds])

  useEffect(() => {
    if (!isRunning) {
      setRemainingSeconds(selectedDuration)
    }
  }, [isRunning, selectedDuration])

  const elapsedSeconds = selectedDuration - remainingSeconds

  const currentStepInfo = useMemo(() => {
    if (remainingSeconds === 0) {
      return {
        label: '完成',
        remainingInStep: 0,
        hint: '你已经完成了这次放松练习。',
      }
    }

    const result = getCurrentStep(currentPattern, elapsedSeconds)
    return {
      label: result.step.label,
      remainingInStep: result.remainingInStep,
      hint: result.step.hint,
    }
  }, [currentPattern, elapsedSeconds, remainingSeconds])

  const progressPercent = Math.round((elapsedSeconds / selectedDuration) * 100)

  const handleStart = (): void => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(selectedDuration)
    }
    setIsRunning(true)
  }

  const handleReset = (): void => {
    setIsRunning(false)
    setRemainingSeconds(selectedDuration)
  }

  return (
    <div className="breathe-layout">
      <h2>呼吸放松</h2>
      <p className="subtle-text">当孩子紧张、生气或害怕时，可以先做一轮简单的呼吸练习。</p>

      <div className="module-grid">
        <section className="module-card">
          <h3>选择练习方式</h3>
          <div className="pattern-grid">
            {BREATH_PATTERNS.map((pattern) => (
              <button
                key={pattern.id}
                type="button"
                className={`pattern-card ${selectedPatternId === pattern.id ? 'active' : ''}`}
                onClick={() => setSelectedPatternId(pattern.id)}
              >
                <strong>{pattern.name}</strong>
                <span>{pattern.description}</span>
              </button>
            ))}
          </div>

          <div className="module-field">
            <p className="module-label">练习时长</p>
            <div className="module-chip-row">
              {DURATION_OPTIONS.map((seconds) => (
                <button
                  key={seconds}
                  type="button"
                  className={`module-chip ${selectedDuration === seconds ? 'active' : ''}`}
                  onClick={() => setSelectedDuration(seconds)}
                >
                  {seconds / 60} 分钟
                </button>
              ))}
            </div>
          </div>

          <div className="summary-banner">
            <p>{currentPattern.description}</p>
          </div>
        </section>

        <aside className="module-card breathe-focus">
          <h3>跟着节奏做</h3>
          <div className="breathe-orb">
            <span className="breathe-phase">{currentStepInfo.label}</span>
            <span className="breathe-step-time">
              {currentStepInfo.remainingInStep > 0 ? `${currentStepInfo.remainingInStep} 秒` : '已完成'}
            </span>
          </div>

          <p className="quiz-score">{formatTime(remainingSeconds)}</p>
          <p className="subtle-text">{currentStepInfo.hint}</p>

          <div className="progress-bar" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="module-actions breathe-actions">
            {!isRunning && (
              <button type="button" className="primary-btn" onClick={handleStart}>
                {remainingSeconds === selectedDuration ? '开始练习' : '继续练习'}
              </button>
            )}
            {isRunning && (
              <button type="button" className="secondary-btn" onClick={() => setIsRunning(false)}>
                暂停
              </button>
            )}
            <button type="button" className="secondary-btn" onClick={handleReset}>
              重新开始
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
