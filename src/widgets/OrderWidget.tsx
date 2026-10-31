import { useState } from 'react'
import type { WidgetProps } from '../types'
import { shuffled } from '../lib/random'
import { toArabicDigits } from '../lib/arabicDigits'
import { RichText } from '../components/RichText'

export interface OrderItem {
  text: string
  /** تلميح يظهر إذا كان العنصر في مكان خاطئ */
  why?: string
}

export interface OrderData {
  prompt: string
  /** إن كانت graded فالعناصر مكتوبة بالترتيب الصحيح وتُخلط عند العرض */
  items: OrderItem[]
  graded: boolean
  doneText?: string
}

function initialOrder(d: OrderData): number[] {
  const idx = d.items.map((_, i) => i)
  if (!d.graded || idx.length < 2) return idx
  for (let t = 0; t < 10; t++) {
    const s = shuffled(idx)
    if (s.some((v, i) => v !== i)) return s
  }
  return [...idx].reverse()
}

export function OrderWidget({ data, onDone }: WidgetProps) {
  const d = data as OrderData
  const [order, setOrder] = useState<number[]>(() => initialOrder(d))
  const [wrongPos, setWrongPos] = useState<number[]>([])
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [finished, setFinished] = useState(false)

  const move = (pos: number, dir: -1 | 1) => {
    const to = pos + dir
    if (finished || to < 0 || to >= order.length) return
    setOrder((o) => {
      const n = [...o]
      const t = n[pos]
      n[pos] = n[to]
      n[to] = t
      return n
    })
    setWrongPos([])
    setMsg(null)
  }

  const finish = () => {
    setFinished(true)
    setMsg({ ok: true, text: d.doneText ?? 'ترتيب ممتاز! 🎉' })
    onDone()
  }

  const check = () => {
    const wrong = order.map((v, i) => (v === i ? -1 : i)).filter((i) => i >= 0)
    setWrongPos(wrong)
    if (wrong.length === 0) {
      finish()
      return
    }
    const first = d.items[order[wrong[0]]]
    setMsg({
      ok: false,
      text: `«${first.text}» مو بمكانها. ${first.why ?? 'فكّري شو لازم يصير قبلها وشو بعدها.'}`,
    })
  }

  return (
    <div className="card order">
      <div className="prompt">
        <RichText text={d.prompt} />
      </div>
      <ol className="order-list">
        {order.map((itemIdx, pos) => (
          <li key={itemIdx} className={`order-row ${wrongPos.includes(pos) ? 'wrong' : ''}`}>
            <span className="order-num">{toArabicDigits(pos + 1)}</span>
            <span className="order-text">{d.items[itemIdx].text}</span>
            <span className="order-btns">
              <button className="secondary" aria-label="للأعلى" disabled={finished || pos === 0} onClick={() => move(pos, -1)}>
                ▲
              </button>
              <button
                className="secondary"
                aria-label="للأسفل"
                disabled={finished || pos === order.length - 1}
                onClick={() => move(pos, 1)}
              >
                ▼
              </button>
            </span>
          </li>
        ))}
      </ol>
      {!finished && (
        <button className="primary" onClick={d.graded ? check : finish}>
          {d.graded ? 'تحقّقي من الترتيب ✔️' : 'خلّصت الترتيب ✅'}
        </button>
      )}
      {msg && (
        <div className={`feedback ${msg.ok ? 'ok' : 'bad'}`}>
          <RichText text={(msg.ok ? '✅ ' : '❌ ') + msg.text} />
        </div>
      )}
    </div>
  )
}