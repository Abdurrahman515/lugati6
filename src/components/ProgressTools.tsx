import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { exportProgress, importProgress } from '../lib/store'

export function ProgressTools() {
  const [msg, setMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const doExport = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lugha-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const doImport = async (file: File | undefined) => {
    if (!file) return
    const ok = importProgress(await file.text())
    setMsg(ok ? 'تم استيراد التقدم ✅' : 'الملف غير صالح ❌')
  }

  return (
    <div className="tools">
      <button className="secondary" onClick={doExport}>
        <Download size={18} /> تصدير التقدم
      </button>
      <button className="secondary" onClick={() => inputRef.current?.click()}>
        <Upload size={18} /> استيراد التقدم
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          void doImport(file)
        }}
      />
      {msg && <span className="muted">{msg}</span>}
    </div>
  )
}