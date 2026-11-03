import { useEffect, useRef, useState } from 'react'
import type { ChoiceQuestion } from '../types'
import { toArabicDigits } from '../lib/arabicDigits'
import { correctAnswerOf, explanationOf } from '../lib/exam'
import { shuffled } from '../lib/random'
import { buildSpeedSet, SPEED_COUNT, SPEED_SECONDS } from '../lib/speed'
import type { SpeedTool } from '../lib/speed'
import { getProgress, recordSpeed, useProgress } from '../lib/store'
import { findSpeedTool } from '../speed'
import { RichText } from './RichText'

interface SpeedRecord {
  q: ChoiceQuestion
  pickedText: string | null
  pickedWhy: string
  ok: boolean
  ms: number | null
}

const TOTAL_MS = SPEED_SECONDS * 1000

function SpeedQuestion({ q, onAnswer }: { q: ChoiceQuestion; onAnswer: (r: SpeedRecord) => void }) {
  const [order] = useState(() => shuffled(q.choices.map((_, i) => i)))
  const [picked, setPicked] = useState<number | null>(null)
  const [timedOut, setTimedOut] = useState(false)
  const [left, setLeft] = useState(TOTAL_MS)
  const startedAt = useRef(0)
  const took = useRef<number | null>(null)
  const latest = useRef(onAnswer)

  useEffect(() => {
    latest.current = onAnswer
  })

  const over = picked !== null || timedOut

  // المؤقت: يُحسب من الساعة لا من عدد النبضات، فيبقى دقيقاً إن تباطأ المتصفح
  useEffect(() => {
    if (over) return
    const start = Date.now()
    startedAt.current = start
    const id = window.setInterval(() => {
      const remain = TOTAL_MS - (Date.now() - start)
      if (remain <= 0) {
        setLeft(0)
        setTimedOut(true)
      } else {
        setLeft(remain)
      }
    }, 100)
    return () => window.clearInterval(id)
  }, [over])

  // بعد الإجابة أو انتهاء الوقت: وقفة قصيرة تُظهر الصحيح ثم ننتقل
  useEffect(() => {
    if (!over) return
    const chosen = picked === null ? null : q.choices[picked]
    const id = window.setTimeout(
      () => {
        latest.current({
          q,
          pickedText: chosen?.text ?? null,
          pickedWhy: chosen?.why ?? '',
          ok: Boolean(chosen?.correct),
          ms: took.current,
        })
      },
      chosen?.correct ? 600 : 1500,
    )
    return () => window.clearTimeout(id)
  }, [over, picked, q])

  const choose = (i: number) => {
    if (over) return
    took.current = Date.now() - startedAt.current
    setPicked(i)
  }

  const low = left <= 3000
  return (
    <div className="question">
      <div className="speed-head">
        <span className={`speed-timer${low ? ' low' : ''}`}>⏱️ {toArabicDigits(Math.ceil(left / 1000))}</span>
      </div>
      <div className={`speed-bar${low ? ' low' : ''}`}>
        <span style={{ width: `${(left / TOTAL_MS) * 100}%` }} />
      </div>
      <div className="prompt">
        <RichText text={q.prompt} />
      </div>
      <div className="choices">
        {order.map((i) => {
          const c = q.choices[i]
          const state = !over ? '' : c.correct ? 'right' : picked === i ? 'wrong' : ''
          return (
            <button key={i} className={`choice ${state}`} disabled={over} onClick={() => choose(i)}>
              {c.text}
            </button>
          )
        })}
      </div>
      {timedOut && <div className="feedback bad">⏰ انتهى الوقت! الجواب الصحيح مظلّل بالأخضر.</div>}
    </div>
  )
}

function SpeedRun({
  questions,
  onFinish,
  onQuit,
}: {
  questions: ChoiceQuestion[]
  onFinish: (records: SpeedRecord[]) => void
  onQuit: () => void
}) {
  const [idx, setIdx] = useState(0)
  const [records, setRecords] = useState<SpeedRecord[]>([])
  const score = records.filter((r) => r.ok).length

  const handle = (r: SpeedRecord) => {
    const next = [...records, r]
    if (idx + 1 >= questions.length) {
      onFinish(next)
      return
    }
    setRecords(next)
    setIdx(idx + 1)
  }

  return (
    <div>
      <div className="speed-head">
        <span>
          السؤال {toArabicDigits(idx + 1)} من {toArabicDigits(questions.length)}
        </span>
        <span>✅ {toArabicDigits(score)}</span>
      </div>
      <SpeedQuestion key={idx} q={questions[idx]} onAnswer={handle} />
      <div className="speed-actions">
        <button className="secondary" onClick={onQuit}>
          إنهاء الجولة
        </button>
      </div>
    </div>
  )
}

type Phase =
  | { name: 'intro' }
  | { name: 'play'; questions: ChoiceQuestion[] }
  | { name: 'result'; records: SpeedRecord[]; prev: number | null; isBest: boolean }

function cheer(score: number, total: number): string {
  const p = total > 0 ? score / total : 0
  if (p >= 0.9) return 'ما شاء الله! أنتِ بطلة 🌟'
  if (p >= 0.7) return 'ممتاز! شوي كمان وبتوصلي للقمة 💪'
  if (p >= 0.4) return 'منيح! كمّلي تدرّبي وبتتحسّني 👏'
  return 'ولا يهمك، التدريب هو اللي بيعمل الفرق 🌱'
}

function SpeedTest({ tool }: { tool: SpeedTool }) {
  const progress = useProgress()
  const best = progress.speed[tool.id]
  const [phase, setPhase] = useState<Phase>({ name: 'intro' })
  const [empty, setEmpty] = useState(false)

  const start = () => {
    const questions = buildSpeedSet(tool.makers)
    if (questions.length === 0) {
      setEmpty(true)
      return
    }
    setEmpty(false)
    setPhase({ name: 'play', questions })
  }

  const finish = (records: SpeedRecord[]) => {
    const score = records.filter((r) => r.ok).length
    const prev = getProgress().speed[tool.id]?.score ?? null
    const isBest = recordSpeed(tool.id, score, records.length)
    setPhase({ name: 'result', records, prev, isBest })
  }

  if (phase.name === 'play') {
    return <SpeedRun questions={phase.questions} onFinish={finish} onQuit={() => setPhase({ name: 'intro' })} />
  }

  if (phase.name === 'result') {
    const { records, prev, isBest } = phase
    const score = records.filter((r) => r.ok).length
    const times = records.filter((r) => r.ok && r.ms !== null).map((r) => r.ms as number)
    const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length / 100) / 10 : null
    const missed = records.filter((r) => !r.ok)
    return (
      <div>
        <div className="speed-score">
          {toArabicDigits(score)} من {toArabicDigits(records.length)}
        </div>
        <p className="speed-center">{cheer(score, records.length)}</p>
        {isBest && prev !== null && <p className="speed-center">🏆 رقم قياسي جديد! كان {toArabicDigits(prev)}</p>}
        {isBest && prev === null && <p className="speed-center">🏆 هذه أول نتيجة محفوظة لكِ</p>}
        {!isBest && best && (
          <p className="speed-center muted">أفضل نتيجة لكِ: {toArabicDigits(best.score)} من {toArabicDigits(best.total)}</p>
        )}
        {avg !== null && <p className="speed-center muted">متوسط زمن إجاباتك الصحيحة: {toArabicDigits(avg)} ثانية</p>}

        {missed.length > 0 && (
          <>
            <h3>أسئلة تستاهل المراجعة ({toArabicDigits(missed.length)})</h3>
            <ul className="speed-result-list">
              {missed.map((r, i) => (
                <li key={i} className="speed-miss">
                  <RichText text={r.q.prompt} />
                  <p>{r.pickedText === null ? '⏰ ما لحقتِ تجاوبي' : `❌ إجابتك: ${r.pickedText}`}</p>
                  <p>✅ الصحيح: {correctAnswerOf(r.q)}</p>
                  {r.pickedWhy && <RichText text={r.pickedWhy} />}
                  <RichText text={explanationOf(r.q)} />
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="speed-actions">
          <button className="primary" onClick={start}>
            🔁 جولة جديدة
          </button>
          <a className="lesson-link" href="#/">
            الرجوع للرئيسية
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>
        {tool.emoji} {tool.title}
      </h1>
      <p>{tool.blurb}</p>
      <ul>
        <li>{toArabicDigits(SPEED_COUNT)} سؤالاً مختلفاً في كل جولة.</li>
        <li>{toArabicDigits(SPEED_SECONDS)} ثوانٍ لكل سؤال، وإن انتهى الوقت يُحسب خطأً.</li>
        <li>بلا قفل وبلا نجوم، وتُحفظ أفضل نتيجة فقط.</li>
      </ul>
      <p className="muted">
        {best ? `أفضل نتيجة: ${toArabicDigits(best.score)} من ${toArabicDigits(best.total)}` : 'لم تجرّبيها بعد'}
      </p>
      {(empty || tool.makers.length === 0) && <p className="muted">هذه الأداة قيد التحضير 🛠️</p>}
      <div className="speed-actions">
        <button className="primary" disabled={tool.makers.length === 0} onClick={start}>
          ⚡ ابدئي
        </button>
        <a className="lesson-link" href="#/">
          الرجوع للرئيسية
        </a>
      </div>
    </div>
  )
}

/** صفحة أداة السرعة: يستدعيها التوجيه بمعرّف الأداة */
export function SpeedPage({ id }: { id: string }) {
  const tool = findSpeedTool(id)
  return (
    <main className="speed-page">
      {tool ? (
        <SpeedTest key={tool.id} tool={tool} />
      ) : (
        <>
          <p>ما لقيت هالأداة 🤔</p>
          <a className="lesson-link" href="#/">
            الرجوع للرئيسية
          </a>
        </>
      )}
    </main>
  )
}