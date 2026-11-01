export interface Choice {
  text: string
  correct?: boolean
  why: string
}

export interface QuestionPassage {
  title?: string
  text: string
}

export interface ChoiceQuestion {
  kind: 'choice'
  id: string
  prompt: string
  choices: Choice[]
  passage?: QuestionPassage
}

export interface WrongAnswer {
  text: string
  why: string
}

export interface WrittenQuestion {
  kind: 'written'
  id: string
  prompt: string
  answer: string | string[]
  why: string
  wrong?: WrongAnswer[]
  /** إن كانت المهارة المختبرة إملائية بذاتها تُقارَن الهمزات والتاء والألف المقصورة بدقة */
  exactSpelling?: boolean
  passage?: QuestionPassage
}

export type Question = ChoiceQuestion | WrittenQuestion

export interface RevealCard {
  front: string
  back: string
}

export type Block =
  | { type: 'say'; text: string; emoji?: string }
  | { type: 'passage'; title?: string; text: string }
  | { type: 'reveal'; title?: string; cards: RevealCard[] }
  | { type: 'widget'; widget: string; data?: unknown }
  | { type: 'quiz'; question: Question }
  | { type: 'practice'; title: string; count: number; make: () => Question }

export interface Lesson {
  id: string
  title: string
  emoji: string
  blocks: Block[]
}

export interface ExamConfig {
  id: string
  title: string
  emoji: string
  count: number
  /** نسبة النجاح المئوية */
  passPercent: number
  /** مولّدات الأسئلة: يُوزَّع الاختبار عليها بالتساوي تقريباً */
  makers: (() => Question)[]
  strict?: boolean
  lockHours?: number
}

export interface Station {
  id: string
  title: string
  emoji: string
  /** أول صفحة وآخر صفحة في الكتاب */
  pages: [number, number]
  lessons: Lesson[]
  /** اختبار مراجعة المحطة (اختياري) */
  review?: ExamConfig
}

export interface Unit {
  id: string
  title: string
  stations: Station[]
}

export interface Semester {
  id: string
  title: string
  emoji: string
  units: Unit[]
  midterm?: ExamConfig
  final?: ExamConfig
}

export interface WidgetProps {
  data: unknown
  onDone: () => void
}