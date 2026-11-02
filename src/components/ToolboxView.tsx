import { useMemo, useState } from 'react'
import { EMOTION_OPTIONS } from '../data/scenes'
import type { EmotionLabel } from '../data/scenes'

interface ToolboxItem {
  id: string
  emotion: EmotionLabel
  title: string
  summary: string
  steps: string[]
  phrase: string
}

const TOOLBOX_ITEMS: ToolboxItem[] = [
  {
    id: 'happy-share',
    emotion: '开心',
    title: '分享开心时刻',
    summary: '把开心的事说出来，可以让好心情更久一点。',
    steps: ['告诉一个信任的人今天发生了什么。', '说出自己最开心的那一秒。', '想一想下次还想再做什么。'],
    phrase: '我今天很开心，因为我做成了一件事，我想和你分享。',
  },
  {
    id: 'happy-save',
    emotion: '开心',
    title: '保存快乐回忆',
    summary: '把好事情记下来，下次难过时也能再看看。',
    steps: ['画一张小图或写一句话。', '记住当时的表情和身体感觉。', '把它放进自己的“开心盒子”。'],
    phrase: '我想把这件开心的事记下来，以后再看。',
  },
  {
    id: 'sad-comfort',
    emotion: '难过',
    title: '先安静一下',
    summary: '难过时先让身体慢下来，会比较容易说清楚。',
    steps: ['找一个安静的位置坐下。', '慢慢吸气 4 秒，再慢慢呼气 6 秒。', '把手放在肚子上，感觉身体慢下来。'],
    phrase: '我现在有点难过，想先安静一下。',
  },
  {
    id: 'sad-say',
    emotion: '难过',
    title: '说出失落原因',
    summary: '把难过的原因说出来，别人才能更好地帮助你。',
    steps: ['先说“我现在有点难过”。', '再说发生了什么。', '最后说你希望别人怎么帮你。'],
    phrase: '我有点难过，因为事情没有像我想的那样。',
  },
  {
    id: 'angry-stop',
    emotion: '生气',
    title: '停一下再反应',
    summary: '先停住身体，再决定怎么做，会更安全。',
    steps: ['双手握一握再放松。', '在心里慢慢数到 5。', '等声音变小一点再开口。'],
    phrase: '我现在很生气，我想先停一下再说。',
  },
  {
    id: 'angry-move',
    emotion: '生气',
    title: '让力气有出口',
    summary: '把身体里的紧绷释放出来，情绪会比较容易下来。',
    steps: ['捏抱枕、压黏土或推墙 10 秒。', '做 5 次深呼吸。', '喝一口水，再回来说问题。'],
    phrase: '我想先动一动，让自己冷静下来。',
  },
  {
    id: 'fear-safe',
    emotion: '害怕',
    title: '先找到安全的人',
    summary: '害怕时最重要的是先确认自己是安全的。',
    steps: ['走到老师、家长或熟悉的大人身边。', '看看周围有没有灯、门和熟悉的东西。', '告诉对方你现在有点害怕。'],
    phrase: '我现在有点害怕，想先待在你旁边。',
  },
  {
    id: 'fear-ground',
    emotion: '害怕',
    title: '看看身边 5 样东西',
    summary: '把注意力放回眼前，可以减少脑袋里的担心。',
    steps: ['说出你看到的 5 样东西。', '摸一摸身边 4 个东西。', '听一听现在能听到的 3 种声音。'],
    phrase: '我想先看看周围，让自己知道现在是安全的。',
  },
  {
    id: 'relax-keep',
    emotion: '放松',
    title: '把舒服感觉留住',
    summary: '当身体已经放松时，可以顺便记住哪些事情对自己有帮助。',
    steps: ['想想现在为什么这么舒服。', '记住这个地方、声音或动作。', '下次紧张时再做一次。'],
    phrase: '我现在感觉很放松，我想记住这种感觉。',
  },
  {
    id: 'relax-stretch',
    emotion: '放松',
    title: '做一个慢动作伸展',
    summary: '轻轻伸展身体，可以让放松感觉更稳定。',
    steps: ['抬高手臂，慢慢吸气。', '放下肩膀，慢慢呼气。', '轻轻转动脖子和手腕。'],
    phrase: '我想慢慢伸展一下，让身体更舒服。',
  },
]

export default function ToolboxView() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionLabel>('难过')
  const [completedIds, setCompletedIds] = useState<string[]>([])

  const visibleItems = useMemo(
    () => TOOLBOX_ITEMS.filter((item) => item.emotion === selectedEmotion),
    [selectedEmotion],
  )

  const handleToggleDone = (itemId: string): void => {
    setCompletedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    )
  }

  return (
    <div className="toolbox-layout">
      <h2>情绪工具箱</h2>
      <p className="subtle-text">按情绪找到立刻能做的小方法，帮助孩子更快调整自己。</p>

      <section className="module-card">
        <p className="module-label">我现在更接近哪种情绪？</p>
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
      </section>

      <div className="strategy-grid">
        {visibleItems.map((item) => {
          const isDone = completedIds.includes(item.id)

          return (
            <article key={item.id} className={`strategy-card ${isDone ? 'done' : ''}`}>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <ol className="strategy-steps">
                {item.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="summary-banner">
                <p>可以这样说：{item.phrase}</p>
              </div>
              <button
                type="button"
                className={isDone ? 'secondary-btn' : 'primary-btn'}
                onClick={() => handleToggleDone(item.id)}
              >
                {isDone ? '已试过' : '我想试试'}
              </button>
            </article>
          )
        })}
      </div>

      {completedIds.length > 0 && (
        <div className="summary-banner">
          <p>已经选中过 {completedIds.length} 个方法。孩子可以先做一个，再回来看还有没有别的方法适合自己。</p>
        </div>
      )}
    </div>
  )
}
