import { useState } from 'react'
import { motion } from 'framer-motion'
import type { WidgetProps } from '../types'
import { shuffled } from '../lib/random'
import { oopsLine, praiseLine } from '../lib/feedback'
import { RichText } from '../components/RichText'

export interface DuelRound {
  /** الكلمة بهمزة منفصلة */
  word: string
  /** اسم حركة الهمزة */
  hamza: string
  /** اسم حركة الحرف الذي قبلها */
  before: string
  winner: 'hamza' | 'before'
  why: string
  whyNot: string
}

export interface DuelData {
  prompt: string
  rounds: DuelRound[]
}

export function DuelWidget({ data, onDone }: WidgetProps) {
  const d = data as DuelData
  const [order] = useState(() => shuffled(d.rounds.map((_, i) => i)))
  const [pos, setPos] = useState(0)
  const [fb, setFb] = useState<{ ok: boolean; text: string } | null>(null)
  const [tries, setTries] = useState(0)

  const finished = pos >= order.length
  const round: DuelRound | undefined = finished ? undefined : d.rounds[order[pos]]

  const choose = (side: 'hamza' | 'before') => {
    if (!round || fb?.ok) return
    setTries((t) => t + 1)
    if (side === round.winner) setFb({ ok: true, text: `**${praiseLine()}**\n${round.why}` })
    else setFb({ ok: false, text: `**${oopsLine()}**\n${round.whyNot}` })
  }

  const next = () => {
    const n = pos + 1
    setPos(n)
    setFb(null)
    if (n >= order.length) onDone()
  }

  return (
    <div className="card sort">
      <div className="prompt">
        <RichText text={d.prompt} />
      </div>

      {round && (
        <motion.div key={pos} className="sort-card" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
          {round.word}
        </motion.div>
      )}

      {round && (
        <div className="bucket-buttons">
          <button className="bucket-btn" disabled={fb?.ok} onClick={() => choose('hamza')}>
            حركة الهمزة: {round.hamza}
          </button>
          <button className="bucket-btn" disabled={fb?.ok} onClick={() => choose('before')}>
            حركة ما قبلها: {round.before}
          </button>
        </div>
      )}

      {fb && (
        <motion.div
          key={tries}
          className={`feedback ${fb.ok ? 'ok' : 'bad'}`}
          initial={{ opacity: 0, x: fb.ok ? 0 : -12 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <RichText text={(fb.ok ? '✅ ' : '❌ ') + fb.text} />
          {fb.ok && (
            <button className="primary" onClick={next}>
              {pos + 1 >= order.length ? 'إنهاء' : 'الكلمة التالية ⬅️'}
            </button>
          )}
        </motion.div>
      )}

      {finished && <p className="ok-note">أحسنتِ! فزتِ بكل المباريات 🏆</p>}
    </div>
  )
}