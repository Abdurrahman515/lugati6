import { useState } from 'react'
import type { Question, RevealCard } from '../types'
import { toArabicDigits } from '../lib/arabicDigits'
import { widgets } from '../widgets'
import { QuestionView } from './QuestionView'
import { RichText } from './RichText'

export type Report = (questionId: string, prompt: string, correct: boolean) => void

export function SayBlock({ text, emoji }: { text: string; emoji?: string }) {
  return (
    <div className="say">
      <span className="say-emoji">{emoji ?? '💬'}</span>
      <RichText text={text} />
    </div>
  )
}

export function PassageBlock({ title, text }: { title?: string; text: string }) {
  return (
    <div className="passage">
      {title && <h4>{title}</h4>}
      <RichText text={text} />
    </div>
  )
}

export function RevealBlock({ title, cards }: { title?: string; cards: RevealCard[] }) {
  const [open, setOpen] = useState<boolean[]>(() => cards.map(() => false))
  const toggle = (i: number) => setOpen((o) => o.map((v, j) => (j === i ? !v : v)))
  return (
    <div className="reveal">
      {title && <h3>{title}</h3>}
      <div className="reveal-grid">
        {cards.map((c, i) => (
          <button key={i} className={`flip ${open[i] ? 'open' : ''}`} onClick={() => toggle(i)}>
            <span className="flip-front">{c.front}</span>
            {open[i] ? <RichText text={c.back} /> : <span className="flip-hint">اضغطي لتشوفي 👆</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export function QuizBlock({
  question,
  onReport,
  onDone,
}: {
  question: Question
  onReport: Report
  onDone: () => void
}) {
  return (
    <div className="card">
      <QuestionView
        question={question}
        onResult={(ok) => onReport(question.id, question.prompt, ok)}
        onDone={onDone}
      />
    </div>
  )
}

function buildPractice(make: () => Question, count: number): Question[] {
  const out: Question[] = []
  const seen = new Set<string>()
  for (let tries = 0; out.length < count && tries < count * 20; tries++) {
    const q = make()
    if (seen.has(q.prompt)) continue
    seen.add(q.prompt)
    out.push(q)
  }
  return out
}

export function PracticeBlock({
  title,
  count,
  make,
  onReport,
  onDone,
}: {
  title: string
  count: number
  make: () => Question
  onReport: Report
  onDone: () => void
}) {
  const [questions] = useState(() => buildPractice(make, count))
  const [index, setIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const q = questions[index]
  const isLast = index === questions.length - 1

  return (
    <div className="card practice">
      <h3>{title}</h3>
      <div className="muted">
        سؤال {toArabicDigits(index + 1)} من {toArabicDigits(questions.length)}
      </div>
      <QuestionView
        key={index}
        question={q}
        onResult={(ok) => onReport(`${q.id}#${index}`, q.prompt, ok)}
        onDone={() => {
          setSolved(true)
          if (isLast) onDone()
        }}
      />
      {solved &&
        (isLast ? (
          <p className="ok-note">أحسنتِ! أنهيتِ التدريب ✅</p>
        ) : (
          <button
            className="primary"
            onClick={() => {
              setIndex((i) => i + 1)
              setSolved(false)
            }}
          >
            السؤال التالي ⬅️
          </button>
        ))}
    </div>
  )
}

export function WidgetBlock({
  widget,
  data,
  onDone,
}: {
  widget: string
  data?: unknown
  onDone: () => void
}) {
  const Widget = widgets[widget]
  if (!Widget) {
    return (
      <div className="feedback bad">
        الأداة «{widget}» غير مسجّلة في <code>src/widgets/index.ts</code>.
        <button className="secondary" onClick={onDone}>
          تخطّي
        </button>
      </div>
    )
  }
  return <Widget data={data} onDone={onDone} />
}