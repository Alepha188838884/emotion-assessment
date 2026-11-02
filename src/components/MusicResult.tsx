import { useEffect, useMemo, useState } from 'react'
import { callQwenChat } from '../qwenClient'
import type { MusicAnswer, MusicClip } from '../data/musicClips'

interface MusicResultProps {
  clips: MusicClip[]
  answers: MusicAnswer[]
  onRestart: () => void
}

const MUSIC_SUMMARY_SYSTEM_PROMPT = [
  '你是一位儿童情绪学习老师，请用非常简单的中文鼓励小学生。',
  '请根据学生得分给出2-4句总结。',
  '高分要明显鼓励，低分要温和鼓励并给简单建议。',
  '总结里必须提到“速度、音量、音色”这三个判断线索。',
].join('\n')

function getFallbackSummary(correctCount: number, total: number): string {
  if (correctCount >= Math.ceil(total * 0.8)) {
    return '你在音乐情绪活动中表现很棒！你已经会从速度、音量和音色里找到情绪线索了。继续加油！'
  }

  return '你已经很努力了！下次先听音乐的速度，再注意音量和音色，会更容易判断出情绪。'
}

export default function MusicResult({
  clips,
  answers,
  onRestart,
}: MusicResultProps) {
  const [summary, setSummary] = useState('')
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [isSummaryLoading, setIsSummaryLoading] = useState(true)

  const answerMap = useMemo(
    () => new Map(answers.map((answer) => [answer.clipId, answer])),
    [answers],
  )
  const correctCount = answers.filter((answer) => answer.isEmotionCorrect).length
  const percentage = Math.round((correctCount / clips.length) * 100)

  useEffect(() => {
    let cancelled = false

    const details = clips
      .map((clip) => {
        const answer = answerMap.get(clip.id)
        const chosenEmotion = answer?.isSkipped ? '已跳过' : answer?.chosenEmotion || '未作答'
        const speed = answer?.speed || '未选择'
        const volume = answer?.volume || '未选择'
        const tone = answer?.tone || '未选择'
        const result = answer?.isSkipped
          ? '跳过'
          : answer?.isEmotionCorrect
            ? '正确'
            : '错误'
        const reason = answer?.reasonText || '无'

        return `片段=${clip.title}；正确情绪=${clip.correctEmotion}；学生答案=${chosenEmotion}；速度=${speed}；音量=${volume}；音色=${tone}；结果=${result}；原因=${reason}`
      })
      .join('\n')

    const userPrompt = [
      `学生在音乐情绪练习中得分：${correctCount}/${clips.length}（${percentage}%）。`,
      '请给出简短鼓励总结，并提醒如何根据速度、音量、音色判断情绪。',
      '答题详情：',
      details,
    ].join('\n')

    const run = async (): Promise<void> => {
      setIsSummaryLoading(true)
      setSummaryError(null)

      try {
        const aiSummary = await callQwenChat(MUSIC_SUMMARY_SYSTEM_PROMPT, userPrompt)
        if (!cancelled) {
          setSummary(aiSummary)
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : '生成总结失败，请稍后重试。'
          setSummaryError(message)
          setSummary(getFallbackSummary(correctCount, clips.length))
        }
      } finally {
        if (!cancelled) {
          setIsSummaryLoading(false)
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [answerMap, clips, correctCount, percentage])

  return (
    <div className="music-result-layout">
      <h2>音乐情绪结果</h2>
      <p className="quiz-score">
        你答对了 {correctCount}/{clips.length} 题 ({percentage}%)
      </p>

      <section className="ai-box">
        <h3>AI 音乐学习总结</h3>
        {isSummaryLoading && <p className="loading-text">AI 正在生成总结...</p>}
        {!isSummaryLoading && <p className="ai-message">{summary}</p>}
        {summaryError && <p className="error-text">{summaryError}</p>}
      </section>

      <section>
        <h3>逐题复盘</h3>
        <ul className="music-review-list">
          {clips.map((clip) => {
            const answer = answerMap.get(clip.id)
            const statusClass = answer?.isSkipped
              ? 'skip'
              : answer?.isEmotionCorrect
                ? 'correct'
                : 'wrong'

            return (
              <li key={clip.id} className={`music-review-item ${statusClass}`}>
                <p className="music-review-title">{clip.title}</p>
                <p>正确情绪：{clip.correctEmotion}</p>
                <p>你的答案：{answer?.isSkipped ? '已跳过' : answer?.chosenEmotion || '未作答'}</p>
                <p>
                  你的线索：速度 {answer?.speed || '未选择'} / 音量 {answer?.volume || '未选择'} / 音色{' '}
                  {answer?.tone || '未选择'}
                </p>
                <p>
                  推荐线索：速度 {clip.expectedSpeed} / 音量 {clip.expectedVolume} / 音色{' '}
                  {clip.expectedTone}
                </p>
                <p>你的理由：{answer?.reasonText || '未填写'}</p>
                <span className="review-badge">
                  {answer?.isSkipped ? '已跳过' : answer?.isEmotionCorrect ? '回答正确' : '需要复习'}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <button type="button" className="primary-btn" onClick={onRestart}>
        再练一次
      </button>
    </div>
  )
}
