import { useEffect, useMemo, useState } from 'react'
import { EMOTION_OPTIONS } from '../data/scenes'
import type { EmotionLabel } from '../data/scenes'

type IntensityLevel = 1 | 2 | 3 | 4 | 5

interface CheckInEntry {
  id: number
  emotion: EmotionLabel
  intensity: IntensityLevel
  trigger: string
  bodyFeeling: string
  need: string
  createdAt: string
}

const STORAGE_KEY = 'emotion-checkin-records'

const INTENSITY_OPTIONS: Array<{ value: IntensityLevel; label: string }> = [
  { value: 1, label: '1 很轻' },
  { value: 2, label: '2 有一点' },
  { value: 3, label: '3 中等' },
  { value: 4, label: '4 比较强' },
  { value: 5, label: '5 非常强' },
]

function isIntensityLevel(value: unknown): value is IntensityLevel {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5
}

function readStoredEntries(): CheckInEntry[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)
    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item): item is CheckInEntry => {
      if (!item || typeof item !== 'object') {
        return false
      }

      const candidate = item as Partial<CheckInEntry>
      return (
        typeof candidate.id === 'number' &&
        EMOTION_OPTIONS.includes(candidate.emotion as EmotionLabel) &&
        isIntensityLevel(candidate.intensity) &&
        typeof candidate.trigger === 'string' &&
        typeof candidate.bodyFeeling === 'string' &&
        typeof candidate.need === 'string' &&
        typeof candidate.createdAt === 'string'
      )
    })
  } catch {
    return []
  }
}

function getIntensityLabel(level: IntensityLevel): string {
  return INTENSITY_OPTIONS.find((option) => option.value === level)?.label ?? `${level}`
}

export default function CheckInView() {
  const [entries, setEntries] = useState<CheckInEntry[]>(() => readStoredEntries())
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionLabel | null>(null)
  const [intensity, setIntensity] = useState<IntensityLevel>(3)
  const [triggerText, setTriggerText] = useState('')
  const [bodyText, setBodyText] = useState('')
  const [needText, setNeedText] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      setFormError('保存失败，浏览器暂时不能写入本地记录。')
    }
  }, [entries])

  const recentEntries = entries.slice(0, 5)

  const summaryText = useMemo(() => {
    if (entries.length === 0) {
      return '还没有打卡记录。今天先记录一次感受吧。'
    }

    const emotionCounts = entries.reduce<Record<string, number>>((result, entry) => {
      result[entry.emotion] = (result[entry.emotion] || 0) + 1
      return result
    }, {})

    const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]
    if (!topEmotion) {
      return '最近已经开始认真观察自己的情绪了。'
    }

    return `最近一共记录了 ${entries.length} 次，“${topEmotion[0]}”出现最多，共 ${topEmotion[1]} 次。`
  }, [entries])

  const handleSave = (): void => {
    if (!selectedEmotion) {
      setFormError('请先选择一种情绪。')
      return
    }

    const entry: CheckInEntry = {
      id: Date.now(),
      emotion: selectedEmotion,
      intensity,
      trigger: triggerText.trim(),
      bodyFeeling: bodyText.trim(),
      need: needText.trim(),
      createdAt: new Date().toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    }

    setEntries((prev) => [entry, ...prev])
    setTriggerText('')
    setBodyText('')
    setNeedText('')
    setSelectedEmotion(null)
    setIntensity(3)
    setFormError(null)
  }

  const handleClear = (): void => {
    if (typeof window !== 'undefined' && !window.confirm('确定要清空全部打卡记录吗？')) {
      return
    }

    setEntries([])
    setFormError(null)
  }

  return (
    <div className="checkin-layout">
      <h2>情绪打卡</h2>
      <p className="subtle-text">记录今天的心情变化，帮助孩子更清楚地认识自己。</p>

      <div className="module-grid">
        <section className="module-card">
          <h3>记录一次感受</h3>

          <div className="module-field">
            <p className="module-label">1) 现在更像哪种情绪？</p>
            <div className="module-option-grid">
              {EMOTION_OPTIONS.map((emotion) => (
                <button
                  key={emotion}
                  type="button"
                  className={`emotion-btn ${selectedEmotion === emotion ? 'active' : ''}`}
                  onClick={() => setSelectedEmotion(emotion)}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          <div className="module-field">
            <p className="module-label">2) 这种感觉有多强？</p>
            <div className="intensity-grid">
              {INTENSITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`module-chip ${intensity === option.value ? 'active' : ''}`}
                  onClick={() => setIntensity(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="module-field">
            <label className="module-label" htmlFor="checkin-trigger">
              3) 发生了什么？（可选）
            </label>
            <textarea
              id="checkin-trigger"
              className="ask-textarea"
              rows={3}
              value={triggerText}
              onChange={(event) => setTriggerText(event.target.value)}
              placeholder="例如：排队时有人插队。"
            />
          </div>

          <div className="module-field">
            <label className="module-label" htmlFor="checkin-body">
              4) 身体有什么感觉？（可选）
            </label>
            <textarea
              id="checkin-body"
              className="ask-textarea"
              rows={2}
              value={bodyText}
              onChange={(event) => setBodyText(event.target.value)}
              placeholder="例如：心跳快，肩膀很紧。"
            />
          </div>

          <div className="module-field">
            <label className="module-label" htmlFor="checkin-need">
              5) 现在最想要什么帮助？（可选）
            </label>
            <textarea
              id="checkin-need"
              className="ask-textarea"
              rows={2}
              value={needText}
              onChange={(event) => setNeedText(event.target.value)}
              placeholder="例如：我想先安静一下，或者想找老师说一说。"
            />
          </div>

          <div className="module-actions">
            <button type="button" className="primary-btn" onClick={handleSave}>
              保存打卡
            </button>
            {entries.length > 0 && (
              <button type="button" className="secondary-btn" onClick={handleClear}>
                清空记录
              </button>
            )}
          </div>

          {formError && <p className="error-text">{formError}</p>}
        </section>

        <aside className="module-card">
          <h3>最近记录</h3>

          <div className="stat-grid">
            <article className="stat-card">
              <span>累计打卡</span>
              <strong>{entries.length}</strong>
            </article>
            <article className="stat-card">
              <span>最近一次</span>
              <strong>{entries[0]?.emotion ?? '暂无'}</strong>
            </article>
            <article className="stat-card">
              <span>当前总结</span>
              <strong>{entries[0] ? getIntensityLabel(entries[0].intensity) : '暂无'}</strong>
            </article>
          </div>

          <div className="summary-banner">
            <p>{summaryText}</p>
          </div>

          {recentEntries.length === 0 && (
            <p className="empty-text">还没有打卡记录，先完成左侧的第一条记录吧。</p>
          )}

          <ul className="record-list">
            {recentEntries.map((entry) => (
              <li key={entry.id} className="record-item">
                <div className="record-header">
                  <span className="music-emotion-card">{entry.emotion}</span>
                  <span className="record-meta">{entry.createdAt}</span>
                </div>
                <p>强度：{getIntensityLabel(entry.intensity)}</p>
                <p>发生了什么：{entry.trigger || '未填写'}</p>
                <p>身体感觉：{entry.bodyFeeling || '未填写'}</p>
                <p>我需要：{entry.need || '未填写'}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
