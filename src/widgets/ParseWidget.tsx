import { useState } from 'react'
import type { WidgetProps } from '../types'
import { RichText } from '../components/RichText'
import { oopsLine, praiseLine } from '../lib/feedback'

export interface ParseRole {
  id: string
  label: string
  emoji?: string
}

export interface ParseWord {
  text: string
  /** إن غاب فالكلمة للقراءة فقط ولا تُسأل */
  role?: string
  /** تفسير يظهر عند الإجابة الصحيحة */
  why?: string
  /** تلميح يظهر عند الخطأ دون كشف الجواب */
  hint?: string
}

export interface ParseData {
  prompt: string
  roles: ParseRole[]
  words: ParseWord[]
}

export function ParseWidget({ data, onDone }: WidgetProps) {
  const d = data as ParseData
  const targets = d.words.map((w, i) => (w.role ? i : -1)).filter((i) => i >= 0)
  const [step, setStep] = useState(0)
  const [done, setDone] = useState<Record<number, string>>({})
  const [fb, setFb] = useState<{ ok: boolean; text: string } | null>(null)

  const finished = step >= targets.length
  const cur = finished ? -1 : targets[step]
  const word = cur >= 0 ? d.words[cur] : undefined

  const choose = (roleId: string) => {
    if (!word || fb?.ok) return
    if (roleId === word.role) {
      setDone((p) => ({ ...p, [cur]: roleId }))
      setFb({ ok: true, text: `**${praiseLine()}**\n${word.why ?? ''}` })
    } else {
      const label = d.roles.find((r) => r.id === roleId)?.label ?? ''
      setFb({
        ok: false,
        text: `**${oopsLine()}**\n«${word.text}» مش «${label}». ${word.hint ?? 'فكّري: شو بتعمل هالكلمة بالجملة؟'}`,
      })
    }
  }

  const next = () => {
    const n = step + 1
    setStep(n)
    setFb(null)
    if (n >= targets.length) onDone()
  }

  return (
    <div className="card parse">
      <div className="prompt">
        <RichText text={d.prompt} />
      </div>

      <div className="parse-sentence">
        {d.words.map((w, i) => (
          <span key={i} className={`parse-word ${i === cur ? 'current' : ''} ${done[i] ? `done-${done[i]}` : ''}`}>
            {w.text}
          </span>
        ))}
      </div>

      {word && (
        <>
          <p className="muted" style={{ textAlign: 'center', margin: '0 0 8px' }}>
            شو دور الكلمة المظلّلة؟
          </p>
          <div className="bucket-buttons">
            {d.roles.map((r) => (
              <button key={r.id} className="bucket-btn" disabled={fb?.ok} onClick={() => choose(r.id)}>
                {r.emoji} {r.label}
              </button>
            ))}
          </div>
        </>
      )}

      {fb && (
        <div className={`feedback ${fb.ok ? 'ok' : 'bad'}`}>
          <RichText text={(fb.ok ? '✅ ' : '❌ ') + fb.text} />
          {fb.ok && (
            <button className="primary" onClick={next}>
              {step + 1 >= targets.length ? 'إنهاء' : 'الكلمة التالية ⬅️'}
            </button>
          )}
        </div>
      )}

      {finished && <p className="ok-note">أحسنتِ! لوّنتِ كل الكلمات 🎨</p>}
    </div>
  )
}