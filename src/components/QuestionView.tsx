import { useState } from 'react'
import type { ChoiceQuestion, Question, WrittenQuestion } from '../types'
import { shuffled } from '../lib/random'
import { isAnswerCorrect, normalizeAnswer } from '../lib/arabicText'
import { RichText } from './RichText'

interface Props {
  question: Question
  /** تُستدعى مرة واحدة بنتيجة المحاولة الأولى */
  onResult: (correct: boolean) => void
  /** تُستدعى عندما تُحَلّ المسألة أو يُكشف جوابها */
  onDone: () => void
}

/** استعمليه مع key مرتبط بالسؤال حتى تُعاد تهيئة الحالة لكل سؤال */
export function QuestionView({ question, onResult, onDone }: Props) {
  return question.kind === 'choice' ? (
    <ChoiceView q={question} onResult={onResult} onDone={onDone} />
  ) : (
    <WrittenView q={question} onResult={onResult} onDone={onDone} />
  )
}

interface ViewProps<T> {
  q: T
  onResult: (correct: boolean) => void
  onDone: () => void
}

function ChoiceView({ q, onResult, onDone }: ViewProps<ChoiceQuestion>) {
  const [order] = useState(() => shuffled(q.choices.map((_, i) => i)))
  const [picked, setPicked] = useState<number | null>(null)
  const [reported, setReported] = useState(false)

  const chosen = picked === null ? null : q.choices[picked]
  const solved = Boolean(chosen?.correct)

  const choose = (i: number) => {
    if (solved) return
    setPicked(i)
    const ok = Boolean(q.choices[i].correct)
    if (!reported) {
      setReported(true)
      onResult(ok)
    }
    if (ok) onDone()
  }

  return (
    <div className="question">
      <div className="prompt">
        <RichText text={q.prompt} />
      </div>
      <div className="choices">
        {order.map((i) => {
          const c = q.choices[i]
          const state = picked === i ? (c.correct ? 'right' : 'wrong') : ''
          return (
            <button key={i} className={`choice ${state}`} disabled={solved} onClick={() => choose(i)}>
              {c.text}
            </button>
          )
        })}
      </div>
      {chosen && (
        <div className={`feedback ${solved ? 'ok' : 'bad'}`}>
          <RichText text={(solved ? '✅ ' : '❌ ') + chosen.why} />
          {!solved && <span className="again">جرّبي اختياراً آخر 👆</span>}
        </div>
      )}
    </div>
  )
}

type Status = 'idle' | 'right' | 'wrong' | 'shown'

function WrittenView({ q, onResult, onDone }: ViewProps<WrittenQuestion>) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [msg, setMsg] = useState('')
  const [reported, setReported] = useState(false)

  const finished = status === 'right' || status === 'shown'
  const firstAnswer = Array.isArray(q.answer) ? q.answer[0] : q.answer

  const check = () => {
    if (finished || !text.trim()) return
    const opts = { exactSpelling: q.exactSpelling }
    const ok = isAnswerCorrect(text, q.answer, opts)
    if (!reported) {
      setReported(true)
      onResult(ok)
    }
    if (ok) {
      setStatus('right')
      setMsg(q.why)
      onDone()
      return
    }
    const typed = normalizeAnswer(text, opts)
    const hit = q.wrong?.find((w) => normalizeAnswer(w.text, opts) === typed)
    setStatus('wrong')
    setMsg(hit ? hit.why : 'ليست هذه الإجابة بعد. أعيدي قراءة السؤال وجرّبي مرة ثانية 💪')
  }

  const reveal = () => {
    setStatus('shown')
    setMsg(q.why)
    if (!reported) {
      setReported(true)
      onResult(false)
    }
    onDone()
  }

  return (
    <div className="question">
      <div className="prompt">
        <RichText text={q.prompt} />
      </div>
      <div className="answer-row">
        <input
          className="field"
          lang="ar"
          value={text}
          disabled={finished}
          placeholder="اكتبي إجابتك هنا"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') check()
          }}
        />
        <button className="primary" disabled={finished || !text.trim()} onClick={check}>
          تحقّقي
        </button>
      </div>
      {status !== 'idle' && (
        <div className={`feedback ${status === 'wrong' ? 'bad' : 'ok'}`}>
          {status === 'shown' && <RichText text={`💡 الجواب: **${firstAnswer}**`} />}
          <RichText text={(status === 'right' ? '✅ ' : status === 'wrong' ? '❌ ' : '') + msg} />
          {status === 'wrong' && (
            <button className="secondary" onClick={reveal}>
              أظهري الجواب
            </button>
          )}
        </div>
      )}
    </div>
  )
}