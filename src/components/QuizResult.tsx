import { useEffect, useMemo, useState } from 'react'
import type { QuizAnswer, QuizQuestion } from '../data/scenes'
import { callQwenChat } from '../qwenClient'

interface QuizResultProps {
  questions: QuizQuestion[]
  answers: QuizAnswer[]
  onRestart: () => void
}

const QUIZ_SUMMARY_SYSTEM_PROMPT = [
  '你是一位情绪学习老师，面对小学生给出反馈。',
  '如果得分>=8，请非常鼓励，强调做得好的地方。',
  '如果得分<8，请温和鼓励，并给1-2个非常简单的改进建议。',
  '请用2-4句简短中文，不要使用复杂词汇。',
].join('\n')

function getFallbackSummary(correctCount: number): string {
  if (correctCount >= 8) {
    return '你做得很棒！你已经很会观察别人的情绪了，继续保持。'
  }

  return '你已经很努力了！下次可以先看表情，再想想发生了什么，会更容易判断。'
}

export default function QuizResult({
  questions,
  answers,
  onRestart,
}: QuizResultProps) {
  const [summary, setSummary] = useState('')
  const [isSummaryLoading, setIsSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const answerMap = useMemo(
    () => new Map(answers.map((answer) => [answer.questionId, answer])),
    [answers],
  )

  const correctCount = answers.filter((answer) => answer.isCorrect).length
  const percentage = Math.round((correctCount / questions.length) * 100)

  useEffect(() => {
    let isCancelled = false

    const reviewLines = questions
      .map((question) => {
        const answer = answerMap.get(question.id)
        const chosenEmotion = answer?.chosenEmotion ?? '未作答'
        const resultText = answer?.isCorrect ? '正确' : '错误'

        return `题目${question.id}：场景=${question.scenario}；正确=${question.correctEmotion}；学生作答=${chosenEmotion}；结果=${resultText}`
      })
      .join('\n')

    const userPrompt = [
      `学生总分：${correctCount}/${questions.length}（${percentage}%）`,
      '请根据成绩和答题表现写学习总结。',
      '答题详情：',
      reviewLines,
    ].join('\n')

    const runSummary = async (): Promise<void> => {
      setIsSummaryLoading(true)
      setSummaryError(null)

      try {
        const result = await callQwenChat(
          QUIZ_SUMMARY_SYSTEM_PROMPT,
          userPrompt,
        )
        if (!isCancelled) {
          setSummary(result)
        }
      } catch (error) {
        if (!isCancelled) {
          const message =
            error instanceof Error ? error.message : '生成总结失败，请稍后再试。'
          setSummaryError(message)
          setSummary(getFallbackSummary(correctCount))
        }
      } finally {
        if (!isCancelled) {
          setIsSummaryLoading(false)
        }
      }
    }

    void runSummary()

    return () => {
      isCancelled = true
    }
  }, [answerMap, correctCount, percentage, questions])

  return (
    <div className="quiz-result-layout">
      <h2>测验结果</h2>
      <p className="quiz-score">你答对了 {correctCount}/10 题 ({percentage}%)</p>

      <section className="ai-box">
        <h3>AI 学习总结</h3>
        {isSummaryLoading && <p className="loading-text">AI 正在生成总结...</p>}
        {!isSummaryLoading && <p className="ai-message">{summary}</p>}
        {summaryError && <p className="error-text">{summaryError}</p>}
      </section>

      <section>
        <h3>逐题复盘</h3>
        <ul className="review-list">
          {questions.map((question) => {
            const answer = answerMap.get(question.id)
            const chosenEmotion = answer?.chosenEmotion ?? '未作答'
            const isCorrect = Boolean(answer?.isCorrect)

            return (
              <li
                key={question.id}
                className={`review-item ${isCorrect ? 'correct' : 'wrong'}`}
              >
                <img src={question.imageUrl} alt={question.scenario} />
                <div className="review-content">
                  <p className="review-scenario">{question.scenario}</p>
                  <p>正确情绪：{question.correctEmotion}</p>
                  <p>你的答案：{chosenEmotion}</p>
                  <span className="review-badge">
                    {isCorrect ? '回答正确' : '需要复习'}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <button type="button" className="primary-btn" onClick={onRestart}>
        再测一次
      </button>
    </div>
  )
}
