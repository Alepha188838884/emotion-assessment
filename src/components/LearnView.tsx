import { useState } from 'react'
import { emotionScenes } from '../data/scenes'
import type { EmotionScene } from '../data/scenes'
import { callQwenChat } from '../qwenClient'

type SceneAiState = {
  status: 'idle' | 'loading' | 'success' | 'error'
  message?: string
}

const LEARN_SYSTEM_PROMPT =
  '你是一个情绪小老师，用非常简单的中文帮小学生理解别人正在感受的情绪。'

function buildLearnUserPrompt(scene: EmotionScene): string {
  return [
    '请根据下面场景做解释：',
    `场景描述：${scene.description}`,
    `正确情绪：${scene.correctEmotion}`,
    '请用1-3句非常简单的中文，告诉小朋友为什么这个情绪是合理的。',
  ].join('\n')
}

export default function LearnView() {
  const [selectedScene, setSelectedScene] = useState<EmotionScene | null>(null)
  const [aiStates, setAiStates] = useState<Record<string, SceneAiState>>({})

  const requestSceneExplanation = async (
    scene: EmotionScene,
    force = false,
  ): Promise<void> => {
    const currentState = aiStates[scene.id]
    if (
      !force &&
      (currentState?.status === 'loading' || currentState?.status === 'success')
    ) {
      return
    }

    setAiStates((prev) => ({
      ...prev,
      [scene.id]: { status: 'loading' },
    }))

    try {
      const aiText = await callQwenChat(
        LEARN_SYSTEM_PROMPT,
        buildLearnUserPrompt(scene),
      )

      setAiStates((prev) => ({
        ...prev,
        [scene.id]: { status: 'success', message: aiText },
      }))
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '请求失败，请稍后重试。'

      setAiStates((prev) => ({
        ...prev,
        [scene.id]: { status: 'error', message },
      }))
    }
  }

  const handleSelectScene = (scene: EmotionScene): void => {
    setSelectedScene(scene)
    void requestSceneExplanation(scene)
  }

  const selectedAiState = selectedScene
    ? aiStates[selectedScene.id] ?? { status: 'idle' }
    : null

  return (
    <div className="learn-layout">
      <section className="scene-grid-section">
        <h2>情绪学习卡片</h2>
        <p className="subtle-text">点击任意场景，查看情绪解释。</p>
        <div className="scene-grid">
          {emotionScenes.map((scene) => (
            <button
              key={scene.id}
              className={`scene-card ${selectedScene?.id === scene.id ? 'selected' : ''}`}
              onClick={() => handleSelectScene(scene)}
              type="button"
            >
              <img src={scene.imageUrl} alt={scene.title} className="scene-image" />
              <div className="scene-card-body">
                <h3>{scene.title}</h3>
                <p>正确情绪：{scene.correctEmotion}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <aside className="scene-detail-panel">
        <h2>场景详情</h2>

        {!selectedScene && (
          <p className="empty-text">请先点击左侧场景卡片开始学习。</p>
        )}

        {selectedScene && (
          <div className="scene-detail-content">
            <img
              src={selectedScene.imageUrl}
              alt={selectedScene.title}
              className="scene-detail-image"
            />
            <h3>{selectedScene.title}</h3>
            <p>
              <strong>场景描述：</strong>
              {selectedScene.description}
            </p>
            <p>
              <strong>预设解释：</strong>
              {selectedScene.predefinedExplanation}
            </p>
            <p>
              <strong>目标情绪：</strong>
              {selectedScene.correctEmotion}
            </p>

            <div className="ai-box">
              <h4>AI 小老师解释</h4>

              {selectedAiState?.status === 'idle' && (
                <p className="subtle-text">点击场景后会自动生成解释。</p>
              )}

              {selectedAiState?.status === 'loading' && (
                <p className="loading-text">正在生成解释...</p>
              )}

              {selectedAiState?.status === 'success' && (
                <p className="ai-message">{selectedAiState.message}</p>
              )}

              {selectedAiState?.status === 'error' && (
                <div className="error-wrap">
                  <p className="error-text">{selectedAiState.message}</p>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => void requestSceneExplanation(selectedScene, true)}
                  >
                    重试
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
