import { useState } from 'react'
import {
  EMOTION_OPTIONS,
  quizQuestions,
} from '../data/scenes'
import type { EmotionLabel, QuizAnswer } from '../data/scenes'
import QuizResult from './QuizResult'

export default function QuizView() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = quizQuestions[currentIndex]
  const progressText = `第 ${Math.min(currentIndex + 1, quizQuestions.length)}/${quizQuestions.length} 题`

  const handleChooseEmotion = (emotion: EmotionLabel): void => {
    if (!currentQuestion || isFinished) {
      return
    }

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      chosenEmotion: emotion,
      isCorrect: emotion === currentQuestion.correctEmotion,
    }

    setAnswers((prev) => [...prev, answer])

    if (currentIndex === quizQuestions.length - 1) {
      setIsFinished(true)
      return
    }

    setCurrentIndex((prev) => prev + 1)
  }

  const handleRestart = (): void => {
    setCurrentIndex(0)
    setAnswers([])
    setIsFinished(false)
  }

  if (isFinished) {
    return (
      <QuizResult
        questions={quizQuestions}
        answers={answers}
        onRestart={handleRestart}
      />
    )
  }

  if (!currentQuestion) {
    return <p className="error-text">题目加载失败，请刷新页面重试。</p>
  }

  return (
    <div className="quiz-layout">
      <h2>情绪小测验</h2>
      <p className="subtle-text">看图选情绪，完成 10 题后查看结果。</p>
      <p className="quiz-progress">{progressText}</p>

      <div className="quiz-question-card">
        <img
          src={currentQuestion.imageUrl}
          alt={currentQuestion.scenario}
          className="quiz-question-image"
        />
        <p className="quiz-scenario">{currentQuestion.scenario}</p>

        <div className="emotion-button-grid">
          {EMOTION_OPTIONS.map((emotion) => (
            <button
              key={emotion}
              type="button"
              className="emotion-btn"
              onClick={() => handleChooseEmotion(emotion)}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
