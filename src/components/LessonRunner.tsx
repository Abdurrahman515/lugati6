import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Block, Lesson } from '../types'
import { recordMistake, recordStars } from '../lib/store'
import { toArabicDigits } from '../lib/arabicDigits'
import { PassageBlock, PracticeBlock, QuizBlock, RevealBlock, SayBlock, WidgetBlock } from './Blocks'
import type { Report } from './Blocks'

const needsDone = (b: Block) => b.type === 'quiz' || b.type === 'practice' || b.type === 'widget'

function BlockView({ block, onDone, onReport }: { block: Block; onDone: () => void; onReport: Report }) {
  switch (block.type) {
    case 'say':
      return <SayBlock text={block.text} emoji={block.emoji} />
    case 'passage':
      return <PassageBlock title={block.title} text={block.text} />
    case 'reveal':
      return <RevealBlock title={block.title} cards={block.cards} />
    case 'widget':
      return <WidgetBlock widget={block.widget} data={block.data} onDone={onDone} />
    case 'quiz':
      return <QuizBlock question={block.question} onReport={onReport} onDone={onDone} />
    case 'practice':
      return (
        <PracticeBlock
          title={block.title}
          count={block.count}
          make={block.make}
          onReport={onReport}
          onDone={onDone}
        />
      )
  }
}

interface Summary {
  stars: number
  correct: number
  total: number
}

export function LessonRunner({ lesson, onExit }: { lesson: Lesson; onExit: () => void }) {
  const [attempt, setAttempt] = useState(0)
  const [visible, setVisible] = useState(1)
  const [done, setDone] = useState<Set<number>>(() => new Set())
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [summary, setSummary] = useState<Summary | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (visible > 1) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [visible])

  const total = lesson.blocks.length
  const markDone = (i: number) => setDone((prev) => (prev.has(i) ? prev : new Set(prev).add(i)))

  const report = (i: number): Report => (qid, prompt, correct) => {
    const key = `${i}:${qid}`
    if (results[key] !== undefined) return
    setResults((r) => ({ ...r, [key]: correct }))
    if (!correct) recordMistake({ lessonId: lesson.id, questionId: qid, prompt })
  }

  const finish = () => {
    const entries = Object.values(results)
    const correct = entries.filter(Boolean).length
    const ratio = entries.length === 0 ? 1 : correct / entries.length
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1
    recordStars(lesson.id, stars)
    setSummary({ stars, correct, total: entries.length })
  }

  const restart = () => {
    setVisible(1)
    setDone(new Set())
    setResults({})
    setSummary(null)
    setAttempt((a) => a + 1)
    window.scrollTo(0, 0)
  }

  if (summary) {
    return (
      <main className="runner">
        <motion.div className="card summary" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="big-emoji">{'⭐'.repeat(summary.stars)}</div>
          <h2>أحسنتِ! أنهيتِ «{lesson.title}» 🎉</h2>
          {summary.total > 0 && (
            <p>
              أجبتِ صح من أول مرة على {toArabicDigits(summary.correct)} من {toArabicDigits(summary.total)} سؤال.
            </p>
          )}
          <div className="row">
            <button className="primary" onClick={onExit}>
              الرجوع للرئيسية
            </button>
            <button className="secondary" onClick={restart}>
              أعيدي الدرس 🔁
            </button>
          </div>
        </motion.div>
      </main>
    )
  }

  const current = lesson.blocks[visible - 1]
  const canNext = !needsDone(current) || done.has(visible - 1)
  const isLast = visible >= total

  return (
    <main className="runner">
      <header className="runner-top">
        <button className="back" onClick={onExit}>
          <ArrowRight size={20} /> الرئيسية
        </button>
        <h1>
          {lesson.emoji} {lesson.title}
        </h1>
        <div className="progress" aria-label="التقدم">
          <div className="progress-bar" style={{ width: `${(visible / total) * 100}%` }} />
        </div>
      </header>

      {lesson.blocks.slice(0, visible).map((block, i) => (
        <motion.section
          key={`${attempt}-${i}`}
          className="block"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BlockView block={block} onDone={() => markDone(i)} onReport={report(i)} />
        </motion.section>
      ))}

      <div className="controls">
        {isLast ? (
          <button className="primary" disabled={!canNext} onClick={finish}>
            أنهيتُ الدرس 🎉
          </button>
        ) : (
          <button className="primary" disabled={!canNext} onClick={() => setVisible((v) => v + 1)}>
            التالي ⬅️
          </button>
        )}
      </div>
      <div ref={endRef} />
    </main>
  )
}