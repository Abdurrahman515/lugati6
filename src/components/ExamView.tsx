import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { ExamConfig } from '../types'
import { buildExam, isPassed } from '../lib/exam'
import { recordExam, recordMistake } from '../lib/store'
import { toArabicDigits } from '../lib/arabicDigits'
import { QuestionView } from './QuestionView'
import { RichText } from './RichText'

interface Summary {
  score: number
  total: number
  passed: boolean
}

function ExamRun({ exam, onExit, onRetry }: { exam: ExamConfig; onExit: () => void; onRetry: () => void }) {
  const [questions] = useState(() => buildExam(exam))
  const [index, setIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [index, summary])

  const total = questions.length
  const q = questions[index]
  const isLast = index === total - 1

  const onResult = (ok: boolean) => {
    setResults((r) => {
      const n = [...r]
      n[index] = ok
      return n
    })
    if (!ok) recordMistake({ lessonId: exam.id, questionId: `${q.id}#${index}`, prompt: q.prompt })
  }

  const next = () => {
    if (!isLast) {
      setIndex((i) => i + 1)
      setSolved(false)
      return
    }
    const score = results.filter(Boolean).length
    const passed = isPassed(score, total, exam.passPercent)
    recordExam(exam.id, { score, total, passed })
    setSummary({ score, total, passed })
  }

  if (total === 0) {
    return (
      <main className="runner">
        <div className="feedback bad">تعذّر توليد أسئلة الاختبار.</div>
        <button className="primary" onClick={onExit}>
          الرجوع للرئيسية
        </button>
      </main>
    )
  }

  if (summary) {
    const wrongPrompts = questions.filter((_, i) => results[i] === false)
    const percent = Math.round((summary.score * 100) / summary.total)
    return (
      <main className="runner">
        <motion.div className="card summary" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="big-emoji">{summary.passed ? '🏆' : '💪'}</div>
          <h2>{summary.passed ? 'نجحتِ! أحسنتِ 🎉' : 'ما نجحتِ هالمرة، بس قريبة! 🌱'}</h2>
          <p>
            أجبتِ صح من أول مرة على {toArabicDigits(summary.score)} من {toArabicDigits(summary.total)} (
            {toArabicDigits(percent)}٪). حد النجاح {toArabicDigits(exam.passPercent)}٪.
          </p>
          {wrongPrompts.length > 0 && (
            <div className="exam-wrong">
              <h3>أسئلة تستاهل مراجعة:</h3>
              <ul>
                {wrongPrompts.map((w, i) => (
                  <li key={i}>
                    <RichText text={w.prompt} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="row">
            <button className="primary" onClick={onExit}>
              الرجوع للرئيسية
            </button>
            <button className="secondary" onClick={onRetry}>
              اختبار جديد 🔁
            </button>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="runner">
      <header className="runner-top">
        <button className="back" onClick={onExit}>
          <ArrowRight size={20} /> الرئيسية
        </button>
        <h1>
          {exam.emoji} {exam.title}
        </h1>
        <div className="progress" aria-label="التقدم">
          <div className="progress-bar" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </header>

      <div className="card practice">
        <div className="muted">
          سؤال {toArabicDigits(index + 1)} من {toArabicDigits(total)}
        </div>
        <QuestionView key={index} question={q} onResult={onResult} onDone={() => setSolved(true)} />
      </div>

      <div className="controls">
        <button className="primary" disabled={!solved} onClick={next}>
          {isLast ? 'إنهاء الاختبار 🏁' : 'السؤال التالي ⬅️'}
        </button>
      </div>
    </main>
  )
}

export function ExamView({ exam, onExit }: { exam: ExamConfig; onExit: () => void }) {
  const [attempt, setAttempt] = useState(0)
  return <ExamRun key={attempt} exam={exam} onExit={onExit} onRetry={() => setAttempt((a) => a + 1)} />
}