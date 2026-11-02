export type EmotionLabel = '开心' | '难过' | '生气' | '害怕' | '放松'

export interface EmotionScene {
  id: string
  title: string
  imageUrl: string
  correctEmotion: EmotionLabel
  description: string
  predefinedExplanation: string
}

export interface QuizQuestion {
  id: string
  imageUrl: string
  scenario: string
  correctEmotion: EmotionLabel
}

export interface QuizAnswer {
  questionId: string
  chosenEmotion: EmotionLabel
  isCorrect: boolean
}

export const EMOTION_OPTIONS: EmotionLabel[] = ['开心', '难过', '生气', '害怕', '放松']

export const emotionScenes: EmotionScene[] = [
  {
    id: 'scene-1',
    title: '收到生日礼物',
    imageUrl: '/img/1.jpg',
    correctEmotion: '开心',
    description: '小明打开礼物盒，发现里面是他一直想要的积木。',
    predefinedExplanation: '当我们得到期待很久的礼物时，通常会感到开心和兴奋。',
  },
  {
    id: 'scene-2',
    title: '喜欢的玩具坏了',
    imageUrl: '/img/2.jpg',
    correctEmotion: '难过',
    description: '小雨最喜欢的玩具熊不小心被弄破了。',
    predefinedExplanation: '失去喜欢的东西会让人心里不舒服，容易感到难过。',
  },
  {
    id: 'scene-3',
    title: '被插队了',
    imageUrl: '/img/3.jpg',
    correctEmotion: '生气',
    description: '排队买午餐时，有人突然跑到小刚前面。',
    predefinedExplanation: '当别人不遵守规则、影响公平时，人会容易生气。',
  },
  {
    id: 'scene-4',
    title: '夜里听到奇怪声音',
    imageUrl: '/img/4.jpg',
    correctEmotion: '害怕',
    description: '晚上停电后，小美听到窗外有不熟悉的响声。',
    predefinedExplanation: '遇到看不清、不了解的情况时，很多人会感到害怕。',
  },
  {
    id: 'scene-5',
    title: '公园散步',
    imageUrl: '/img/5.jpg',
    correctEmotion: '放松',
    description: '周末下午，小杰在安静的公园里慢慢散步。',
    predefinedExplanation: '环境安静、安全又舒适时，人通常会更放松。',
  },
  {
    id: 'scene-6',
    title: '和朋友一起画画',
    imageUrl: '/img/6.jpg',
    correctEmotion: '开心',
    description: '美术课上，孩子们一起完成了一幅漂亮的大画。',
    predefinedExplanation: '和朋友合作成功、一起玩耍时，常会感到开心。',
  },
]

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    imageUrl: '/img/happy.png',
    scenario:
      '阳光洒在红色的跑道上。\n\n号码102的小男孩高举金色奖杯，双脚在欢呼声中腾空跃起，胸前的奖牌微微晃动。\n\n身后的横幅写着“第十二届运动会冠军”，看台上旗帜随风招展，掌声如潮水般将他们包围。\n\n远处的红砖教学楼静静立在蓝天下，定格了这枚金灿灿的午后。',
    correctEmotion: '开心',
  },
  {
    id: 'q2',
    imageUrl: '/images/quiz/quiz-2.svg',
    scenario: '小朋友找不到最喜欢的铅笔盒。',
    correctEmotion: '难过',
  },
  {
    id: 'q3',
    imageUrl: '/images/quiz/quiz-3.svg',
    scenario: '小朋友的积木被别人故意推倒。',
    correctEmotion: '生气',
  },
  {
    id: 'q4',
    imageUrl: '/images/quiz/quiz-4.svg',
    scenario: '打雷时小朋友一个人在房间里。',
    correctEmotion: '害怕',
  },
  {
    id: 'q5',
    imageUrl: '/images/quiz/quiz-5.svg',
    scenario: '小朋友听着轻音乐躺在沙发上。',
    correctEmotion: '放松',
  },
  {
    id: 'q6',
    imageUrl: '/images/quiz/quiz-6.svg',
    scenario: '小朋友收到老师表扬的小贴纸。',
    correctEmotion: '开心',
  },
  {
    id: 'q7',
    imageUrl: '/images/quiz/quiz-7.svg',
    scenario: '小朋友的气球飞走了。',
    correctEmotion: '难过',
  },
  {
    id: 'q8',
    imageUrl: '/images/quiz/quiz-8.svg',
    scenario: '有人抢走了小朋友排队的位置。',
    correctEmotion: '生气',
  },
  {
    id: 'q9',
    imageUrl: '/images/quiz/quiz-9.svg',
    scenario: '陌生的大狗突然朝小朋友叫。',
    correctEmotion: '害怕',
  },
  {
    id: 'q10',
    imageUrl: '/images/quiz/quiz-10.svg',
    scenario: '小朋友泡脚后坐在暖暖的毯子里。',
    correctEmotion: '放松',
  },
]
