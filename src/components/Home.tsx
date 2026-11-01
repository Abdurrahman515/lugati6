import { semesters } from '../content'
import type { ExamConfig } from '../types'
import { toArabicDigits } from '../lib/arabicDigits'
import { formatRemaining } from '../lib/time'
import { lockRemaining, useProgress } from '../lib/store'
import type { Progress } from '../lib/store'
import { Collapsible } from './Collapsible'
import { ProgressTools } from './ProgressTools'
import React from 'react'

function ExamLink({ exam, progress }: { exam: ExamConfig; progress: Progress }) {
  const attempts = progress.exams[exam.id] ?? []
  const best = attempts.reduce<number | null>((m, a) => {
    const pct = a.total > 0 ? Math.round((a.score * 100) / a.total) : 0
    return m === null || pct > m ? pct : m
  }, null)
  const everPassed = attempts.some((a) => a.passed)
  const lockMs = exam.lockHours ? lockRemaining(exam.id) : 0

  if (lockMs > 0) {
    return (
      <div className="lesson-link exam-link locked" aria-disabled="true">
        <span>
          {exam.emoji} {exam.title}
        </span>
        <span className="muted">🔒 مقفل {formatRemaining(lockMs)}</span>
      </div>
    )
  }
  return (
    <a className="lesson-link exam-link" href={`#/exam/${exam.id}`}>
      <span>
        {exam.emoji} {exam.title}
      </span>
      <span className="muted">
        {best === null ? 'لم تُحَلّ بعد' : `${everPassed ? '✅ ' : ''}أفضل نتيجة ${toArabicDigits(best)}٪`}
      </span>
    </a>
  )
}

export function Home() {
  const progress = useProgress()
  return (
    <main className="home">
      <header className="hero">
        <div className="hero-emoji">📚</div>
        <h1>لغتي الجميلة</h1>
        <p>الصف السادس الابتدائي</p>
      </header>

      {semesters.map((sem) => (
        <Collapsible key={sem.id} id={sem.id} title={sem.title} emoji={sem.emoji} defaultCollapsed={false}>
          {sem.units.map((u) => (
            <div key={u.id} className="unit">
              <h2 className="unit-title">الوحدة: {u.title}</h2>
              {u.stations.map((st, i) => (
                <React.Fragment key={st.id}>
                  {i === 3 && sem.midterm && <ExamLink exam={sem.midterm} progress={progress} />}

                  <Collapsible
                    key={st.id}
                    id={`${sem.id}/${u.id}/${st.id}`}
                    title={st.title}
                    emoji={st.emoji}
                    subtitle={`ص${toArabicDigits(st.pages[0])}–${toArabicDigits(st.pages[1])}`}
                    defaultCollapsed={i !== 0}
                  >
                    {st.lessons.length === 0 ? (
                      <p className="muted">دروس هذا الجزء قيد التحضير 🛠️</p>
                    ) : (
                      <ul className="lessons">
                        {st.lessons.map((l) => {
                          const stars = progress.stars[l.id] ?? 0
                          return (
                            <li key={l.id}>
                              <a className="lesson-link" href={`#/lesson/${l.id}`}>
                                <span>
                                  {l.emoji} {l.title}
                                </span>
                                <span className="stars">{'⭐'.repeat(stars) + '☆'.repeat(3 - stars)}</span>
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {st.review && st.lessons.length > 0 && <ExamLink exam={st.review} progress={progress} />}
                  </Collapsible>
                </React.Fragment>
              ))}
            </div>
          ))}
          
          {sem.final && <ExamLink exam={sem.final} progress={progress} />}
        </Collapsible>
      ))}

      <ProgressTools />
    </main>
  )
}