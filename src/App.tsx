import { useState } from 'react'
import AskView from './components/AskView'
import BreatheView from './components/BreatheView'
import CheckInView from './components/CheckInView'
import LearnView from './components/LearnView'
import MusicView from './components/MusicView'
import QuizView from './components/QuizView'
import SupportView from './components/SupportView'
import ToolboxView from './components/ToolboxView'

type ViewKey =
  | 'learn'
  | 'ask'
  | 'quiz'
  | 'music'
  | 'checkin'
  | 'breathe'
  | 'toolbox'
  | 'support'

const VIEW_TABS: Array<{ key: ViewKey; label: string }> = [
  { key: 'learn', label: '学习' },
  { key: 'ask', label: '提问' },
  { key: 'quiz', label: '测验' },
  { key: 'music', label: '音乐' },
  { key: 'checkin', label: '打卡' },
  { key: 'breathe', label: '呼吸' },
  { key: 'toolbox', label: '工具箱' },
  { key: 'support', label: '求助' },
]

export default function App() {
  const [activeView, setActiveView] = useState<ViewKey>('learn')

  return (
    <div className="app-shell">
      <header className="top-header">
        <div className="brand-block">
          <p className="brand-kicker">儿童情绪认知训练平台</p>
          <h1>情绪学习</h1>
          <p>和 AI 一起学习识别情绪</p>
        </div>
        <nav className="top-nav" aria-label="主导航">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`nav-btn ${activeView === tab.key ? 'active' : ''}`}
              onClick={() => setActiveView(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <section className="site-description-card">
        <img
          src="/images/org-icon.svg"
          alt="上海青聪泉儿童智能训练中心图标"
          className="org-logo"
        />
        <div className="site-description-content">
          <h2>这个网站是做什么的？</h2>
          <p>
            这是一个给儿童使用的情绪学习网站，帮助孩子通过图片、提问、测验和音乐活动，认识开心、难过、生气、害怕、放松等常见情绪。
          </p>
          <p>
            孩子可以在“学习”中理解情绪场景，在“提问”里获得 AI
            情绪判断，在“测验”里练习并查看自己的学习结果，也可以在“音乐”中通过听觉学习识别情绪；还可以用“打卡”记录心情，用“呼吸”练习放松，在“工具箱”和“求助”里找到实用做法。
          </p>
          <p className="org-name">机构：上海青聪泉儿童智能训练中心</p>
        </div>
      </section>

      <main className="app-main">
        <section
          className={`view-panel ${activeView === 'learn' ? 'is-active' : ''}`}
          aria-hidden={activeView !== 'learn'}
        >
          <LearnView />
        </section>

        <section
          className={`view-panel ${activeView === 'ask' ? 'is-active' : ''}`}
          aria-hidden={activeView !== 'ask'}
        >
          <AskView />
        </section>

        <section
          className={`view-panel ${activeView === 'quiz' ? 'is-active' : ''}`}
          aria-hidden={activeView !== 'quiz'}
        >
          <QuizView />
        </section>

        <section
          className={`view-panel ${activeView === 'music' ? 'is-active' : ''}`}
          aria-hidden={activeView !== 'music'}
        >
          <MusicView />
        </section>

        <section
          className={`view-panel ${activeView === 'checkin' ? 'is-active' : ''}`}
          aria-hidden={activeView !== 'checkin'}
        >
          <CheckInView />
        </section>

        <section
          className={`view-panel ${activeView === 'breathe' ? 'is-active' : ''}`}
          aria-hidden={activeView !== 'breathe'}
        >
          <BreatheView />
        </section>

        <section
          className={`view-panel ${activeView === 'toolbox' ? 'is-active' : ''}`}
          aria-hidden={activeView !== 'toolbox'}
        >
          <ToolboxView />
        </section>

        <section
          className={`view-panel ${activeView === 'support' ? 'is-active' : ''}`}
          aria-hidden={activeView !== 'support'}
        >
          <SupportView />
        </section>
      </main>
    </div>
  )
}
