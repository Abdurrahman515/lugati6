import { useState } from 'react'
import type { WidgetProps } from '../types'
import { toArabicDigits } from '../lib/arabicDigits'
import { RichText } from '../components/RichText'

export interface ScanRound {
  goal: string
  lines: string[]
  /** رقم السطر الذي فيه الجواب */
  target: number
  /** رسالة النجاح */
  found: string
  /** رسائل خاصة للأسطر المشتِّتة، بمفتاح رقم السطر */
  misses?: Record<number, string>
}

export interface ScanData {
  prompt: string
  rounds: ScanRound[]
}

export function ScanWidget({ data, onDone }: WidgetProps) {
  const d = data as ScanData
  const [round, setRound] = useState(0)
  const [tapped, setTapped] = useState<number[]>([])
  const [found, setFound] = useState(false)
  const [msg, setMsg] = useState('')
  const [missCount, setMissCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const r = d.rounds[round]

  const tap = (i: number) => {
    if (found || tapped.includes(i)) return
    setTapped((t) => [...t, i])
    if (i === r.target) {
      setFound(true)
      setMsg(r.found)
    } else {
      setMissCount((n) => n + 1)
      setMsg(r.misses?.[i] ?? 'هاي معلومة مش هدفك. ما توقفي عندها وكملي تمشيط 🏃‍♀️')
    }
  }

  const next = () => {
    if (round + 1 >= d.rounds.length) {
      setFinished(true)
      onDone()
      return
    }
    setRound(round + 1)
    setTapped([])
    setFound(false)
    setMsg('')
  }

  if (finished) {
    return (
      <div className="card scan">
        <p className="ok-note">
          خلّصتِ كل الجولات! 🎉 عدد المرات اللي وقفتِ فيها عند سطر مش هدفك: {toArabicDigits(missCount)}. كل ما قلّت، صار تمشيطك أشطر 💪
        </p>
      </div>
    )
  }

  return (
    <div className="card scan">
      <div className="prompt">
        <RichText text={d.prompt} />
      </div>
      <div className="muted">
        الجولة {toArabicDigits(round + 1)} من {toArabicDigits(d.rounds.length)}
      </div>
      <div className="scan-goal">
        <RichText text={`🎯 هدفك: **${r.goal}**`} />
      </div>
      <div className="scan-lines">
        {r.lines.map((line, i) => {
          const state = tapped.includes(i) ? (i === r.target ? 'hit' : 'miss') : ''
          return (
            <button key={i} className={`scan-line ${state}`} disabled={found} onClick={() => tap(i)}>
              {line}
            </button>
          )
        })}
      </div>
      {msg && (
        <div className={`feedback ${found ? 'ok' : 'bad'}`}>
          <RichText text={(found ? '✅ ' : '❌ ') + msg} />
          {found && (
            <button className="primary" onClick={next}>
              {round + 1 >= d.rounds.length ? 'إنهاء' : 'الجولة التالية ⬅️'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}