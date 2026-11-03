import { useState } from 'react'

export function CertificatePrompt({ examTitle }: { examTitle: string }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const print = async () => {
    const clean = name.trim().replace(/\s+/g, ' ')
    if (clean.length < 2) {
      setError('اكتبي اسمك أولاً 🌸')
      return
    }
    setBusy(true)
    setError('')
    try {
      const { buildCertificatePdf, downloadBlob } = await import('../lib/certificate')
      const blob = await buildCertificatePdf({ name: clean, examTitle })
      downloadBlob(blob, 'شهادة-لغتي.pdf')
    } catch {
      setError('تعذّر إنشاء الشهادة، جرّبي مرة ثانية.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="cert-box">
      <h3>🎓 شهادة شكر وتقدير</h3>
      <p>اكتبي اسمك لتطبعي شهادتك:</p>
      <input
        className="cert-input"
        type="text"
        value={name}
        maxLength={40}
        placeholder="اسم الطالبة"
        aria-label="اسم الطالبة"
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !busy) void print()
        }}
      />
      {error && <div className="muted">{error}</div>}
      <button className="primary" disabled={busy} onClick={() => void print()}>
        {busy ? 'جارٍ تجهيز الشهادة…' : 'طباعة الشهادة 🖨️'}
      </button>
    </div>
  )
}