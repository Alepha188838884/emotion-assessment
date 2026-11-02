import { useState } from 'react'
import { callQwenChat } from '../qwenClient'

interface AskHistoryItem {
  id: number
  question: string
  answer: string
  createdAt: string
}

const ASK_SYSTEM_PROMPT = [
  '你是一个情绪小老师，请用非常简单的中文回答小学生。',
  '输出格式必须严格遵守：',
  '第一行：情绪：<开心|难过|生气|害怕|放松>',
  '然后用1-3句简短中文解释理由，语气温和、儿童友好。',
].join('\n')

export default function AskView() {
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [history, setHistory] = useState<AskHistoryItem[]>([])

  const handleAsk = async (): Promise<void> => {
    const question = inputText.trim()
    if (!question || isLoading) {
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    const userPrompt = [
      '请判断下面情境最可能的情绪，并按固定格式回答。',
      `情境：${question}`,
    ].join('\n')

    try {
      const answer = await callQwenChat(ASK_SYSTEM_PROMPT, userPrompt)

      setHistory((prev) => [
        {
          id: Date.now(),
          question,
          answer,
          createdAt: new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }),
        },
        ...prev,
      ])

      setInputText('')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '请求失败，请稍后再试。'
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="ask-layout">
      <h2>向 AI 提问</h2>
      <p className="subtle-text">描述一个场景，AI 会帮你判断情绪并解释原因。</p>

      <textarea
        className="ask-textarea"
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        placeholder="例如：我今天在学校演讲前，手心一直出汗，心跳很快。"
        rows={5}
      />

      <div className="ask-actions">
        <button
          type="button"
          className="primary-btn"
          onClick={() => void handleAsk()}
          disabled={!inputText.trim() || isLoading}
        >
          {isLoading ? 'AI 思考中...' : 'Ask AI'}
        </button>
      </div>

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      <section className="history-section">
        <h3>提问记录</h3>

        {history.length === 0 && (
          <p className="empty-text">还没有提问记录，先输入一个场景吧。</p>
        )}

        <ul className="history-list">
          {history.map((item) => (
            <li key={item.id} className="history-item">
              <p className="history-time">{item.createdAt}</p>
              <p>
                <strong>你：</strong>
                {item.question}
              </p>
              <pre className="history-answer">
                <strong>AI：</strong>
                {item.answer}
              </pre>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
