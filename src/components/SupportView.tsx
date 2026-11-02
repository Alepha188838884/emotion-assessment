import { useMemo, useState } from 'react'
import { EMOTION_OPTIONS } from '../data/scenes'
import type { EmotionLabel } from '../data/scenes'

type HelperId = 'teacher' | 'parent' | 'family' | 'friend'

interface HelperOption {
  id: HelperId
  label: string
  description: string
}

const HELPER_OPTIONS: HelperOption[] = [
  { id: 'teacher', label: '老师', description: '适合在学校里需要帮助的时候。' },
  { id: 'parent', label: '爸爸妈妈', description: '适合想找最熟悉的大人时。' },
  { id: 'family', label: '家人', description: '适合想找家里其他大人时。' },
  { id: 'friend', label: '朋友', description: '适合想先找同伴陪一陪时。' },
]

const HELP_NEEDS = [
  '听我说一说',
  '陪我待一会儿',
  '带我去安静一下',
  '帮我一起想办法',
]

function buildSupportText(
  helper: HelperOption,
  emotion: EmotionLabel,
  reasonText: string,
  helpNeed: string,
): string {
  const cleanedReason = reasonText.trim() || '我心里有点不舒服'
  return `${helper.label}，你好。我现在有点${emotion}，因为${cleanedReason}。你可以先${helpNeed}吗？`
}

export default function SupportView() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionLabel>('害怕')
  const [selectedHelperId, setSelectedHelperId] = useState<HelperId>('teacher')
  const [selectedNeed, setSelectedNeed] = useState(HELP_NEEDS[0])
  const [reasonText, setReasonText] = useState('')
  const [copyMessage, setCopyMessage] = useState<string | null>(null)

  const selectedHelper =
    HELPER_OPTIONS.find((option) => option.id === selectedHelperId) ?? HELPER_OPTIONS[0]

  const supportText = useMemo(
    () => buildSupportText(selectedHelper, selectedEmotion, reasonText, selectedNeed),
    [reasonText, selectedEmotion, selectedHelper, selectedNeed],
  )

  const handleCopy = async (): Promise<void> => {
    if (!navigator.clipboard) {
      setCopyMessage('当前浏览器不支持自动复制，请手动复制下面的话。')
      return
    }

    try {
      await navigator.clipboard.writeText(supportText)
      setCopyMessage('已经复制到剪贴板。')
    } catch {
      setCopyMessage('复制失败，请手动复制下面的话。')
    }
  }

  return (
    <div className="support-layout">
      <h2>求助卡</h2>
      <p className="subtle-text">把难开口的话先整理出来，孩子更容易向别人表达自己的需要。</p>

      <div className="module-grid">
        <section className="module-card">
          <div className="module-field">
            <p className="module-label">1) 我现在更接近哪种情绪？</p>
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
            <p className="module-label">2) 想找谁帮忙？</p>
            <div className="helper-grid">
              {HELPER_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`helper-card ${selectedHelperId === option.id ? 'active' : ''}`}
                  onClick={() => setSelectedHelperId(option.id)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="module-field">
            <label className="module-label" htmlFor="support-reason">
              3) 想简单说一下原因
            </label>
            <textarea
              id="support-reason"
              className="ask-textarea"
              rows={3}
              value={reasonText}
              onChange={(event) => setReasonText(event.target.value)}
              placeholder="例如：刚刚打雷的时候我一个人在教室外面。"
            />
          </div>

          <div className="module-field">
            <p className="module-label">4) 我最需要什么帮助？</p>
            <div className="module-chip-row">
              {HELP_NEEDS.map((need) => (
                <button
                  key={need}
                  type="button"
                  className={`module-chip ${selectedNeed === need ? 'active' : ''}`}
                  onClick={() => setSelectedNeed(need)}
                >
                  {need}
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="module-card">
          <h3>我可以这样说</h3>
          <div className="script-card">
            <p>{supportText}</p>
          </div>

          <div className="module-actions">
            <button type="button" className="primary-btn" onClick={() => void handleCopy()}>
              复制这句话
            </button>
          </div>

          {copyMessage && <p className="subtle-text">{copyMessage}</p>}

          <div className="summary-banner">
            <p>小提醒：先说自己的情绪，再说发生了什么，最后说希望别人怎么帮你，会更容易被听懂。</p>
          </div>

          <ol className="tip-list">
            <li>如果一时说不出来，可以先把这句话读给对方听。</li>
            <li>如果还是紧张，可以先做一次“呼吸放松”再来表达。</li>
            <li>当你觉得不安全时，要优先去找身边可信任的大人。</li>
          </ol>
        </aside>
      </div>
    </div>
  )
}
