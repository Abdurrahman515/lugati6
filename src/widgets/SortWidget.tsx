import { useState } from 'react'
import { motion } from 'framer-motion'
import type { WidgetProps } from '../types'
import { shuffled } from '../lib/random'
import { RichText } from '../components/RichText'

export interface SortBucket {
  id: string
  label: string
  emoji?: string
}

export interface SortItem {
  text: string
  bucket: string
  /** تفسير يظهر عند التصنيف الصحيح */
  why: string
  /** تفسير لكل تصنيف خاطئ، بمفتاح معرّف الصندوق */
  whyNot: Record<string, string>
}

export interface SortData {
  prompt: string
  buckets: SortBucket[]
  items: SortItem[]
}

export function SortWidget({ data, onDone }: WidgetProps) {
  const d = data as SortData
  const [order] = useState(() => shuffled(d.items.map((_, i) => i)))
  const [pos, setPos] = useState(0)
  const [placed, setPlaced] = useState<Record<string, string[]>>({})
  const [fb, setFb] = useState<{ ok: boolean; text: string } | null>(null)
  const [tries, setTries] = useState(0)

  const finished = pos >= order.length
  const item: SortItem | undefined = finished ? undefined : d.items[order[pos]]

  const choose = (bucketId: string) => {
    if (!item || fb?.ok) return
    setTries((t) => t + 1)
    if (bucketId === item.bucket) {
      setPlaced((p) => ({ ...p, [bucketId]: [...(p[bucketId] ?? []), item.text] }))
      setFb({ ok: true, text: item.why })
    } else {
      setFb({ ok: false, text: item.whyNot[bucketId] ?? 'ليس هذا هو التصنيف الصحيح، فكّري مرة ثانية.' })
    }
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

      {item && (
        <motion.div key={pos} className="sort-card" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
          {item.text}
        </motion.div>
      )}

      {item && (
        <div className="bucket-buttons">
          {d.buckets.map((b) => (
            <button key={b.id} className="bucket-btn" disabled={fb?.ok} onClick={() => choose(b.id)}>
              {b.emoji} {b.label}
            </button>
          ))}
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

      {finished && <p className="ok-note">أحسنتِ! صنّفتِ كل الكلمات 🎉</p>}

      <div className="buckets">
        {d.buckets.map((b) => (
          <div key={b.id} className="bucket">
            <h4>
              {b.emoji} {b.label}
            </h4>
            <div className="chips">
              {(placed[b.id] ?? []).map((t, i) => (
                <span key={i} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}