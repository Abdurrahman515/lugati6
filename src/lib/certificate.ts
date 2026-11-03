import '@fontsource/tajawal/arabic-400.css'
import '@fontsource/tajawal/arabic-700.css'
import '@fontsource/tajawal/arabic-800.css'

export interface CertificateOptions {
  name: string
  examTitle: string
  date?: Date
}

/** إحداثيات التصميم (وحدات منطقية) تُكبَّر إلى دقة ٣٠٠ dpi لورق A4 أفقي */
const DESIGN_W = 1123
const DESIGN_H = 794
const CANVAS_W = 3508
const PDF_W = 841.89
const PDF_H = 595.28
const FONT = 'Tajawal, sans-serif'
const GLYPHS = 'ابتثجحخدذرزسشصضطظعغفقكلمنهويةءأإآئؤى٠١٢٣٤٥٦٧٨٩،ـ'
const CX = DESIGN_W / 2

const C = {
  bgTop: '#fff8fb',
  bgBottom: '#ffe3ee',
  pattern: 'rgba(236, 72, 153, 0.10)',
  frameDark: '#be185d',
  frame: '#ec4899',
  frameSoft: '#f9a8d4',
  petal: '#f9a8d4',
  petalDeep: '#f472b6',
  pillBg: '#fdf2f8',
  title: '#be185d',
  name: '#db2777',
  text: '#831843',
  soft: '#9d174d',
}

type Ctx = CanvasRenderingContext2D

function roundRectPath(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** نجمة خماسية */
function drawStar(ctx: Ctx, cx: number, cy: number, r: number, color: string) {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rad = i % 2 === 0 ? r : r * 0.45
    const x = cx + Math.cos(a) * rad
    const y = cy + Math.sin(a) * rad
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

/** مسار نجمة ثمانية (خاتَم) للزخرفة الهندسية */
function star8Path(ctx: Ctx, cx: number, cy: number, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 8
    const rad = i % 2 === 0 ? r : r * 0.765
    const x = cx + Math.cos(a) * rad
    const y = cy + Math.sin(a) * rad
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

/** وردة بتلات حول مركز */
function drawRosette(ctx: Ctx, cx: number, cy: number, r: number, petals: number, outer: string, inner: string) {
  for (let i = 0; i < petals; i++) {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate((i * Math.PI * 2) / petals)
    ctx.beginPath()
    ctx.ellipse(0, -r * 0.58, r * 0.27, r * 0.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = outer
    ctx.fill()
    ctx.restore()
  }
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.42, 0, Math.PI * 2)
  ctx.fillStyle = inner
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
}

/** يضبط الخط على أكبر حجم لا يتجاوز عرضه الحد، ويُرجع الحجم */
function fitFont(ctx: Ctx, text: string, size: number, weight: number, maxWidth: number): number {
  let s = size
  ctx.font = `${weight} ${s}px ${FONT}`
  while (ctx.measureText(text).width > maxWidth && s > 16) {
    s -= 2
    ctx.font = `${weight} ${s}px ${FONT}`
  }
  return s
}

/** يرسم سطراً ويُرجع عرضه */
function drawText(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  size: number,
  weight: number,
  color: string,
  maxWidth: number,
): number {
  fitFont(ctx, text, size, weight, maxWidth)
  ctx.fillStyle = color
  ctx.fillText(text, x, y)
  return ctx.measureText(text).width
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-arab', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function drawBackground(ctx: Ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, DESIGN_H)
  g.addColorStop(0, C.bgTop)
  g.addColorStop(1, C.bgBottom)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, DESIGN_W, DESIGN_H)

  // نقش النجوم الثمانية الهندسي، خفيف جداً
  ctx.save()
  ctx.beginPath()
  ctx.rect(46, 46, DESIGN_W - 92, DESIGN_H - 92)
  ctx.clip()
  ctx.strokeStyle = C.pattern
  ctx.lineWidth = 1.5
  for (let y = 46; y < DESIGN_H; y += 56) {
    for (let x = 46; x < DESIGN_W; x += 56) {
      star8Path(ctx, x, y, 22)
      ctx.stroke()
    }
  }
  ctx.restore()
}

function drawFrame(ctx: Ctx) {
  const g = ctx.createLinearGradient(0, 0, DESIGN_W, DESIGN_H)
  g.addColorStop(0, C.frameDark)
  g.addColorStop(0.5, C.frame)
  g.addColorStop(1, C.frameDark)
  ctx.strokeStyle = g
  ctx.lineWidth = 12
  ctx.strokeRect(26, 26, DESIGN_W - 52, DESIGN_H - 52)

  ctx.strokeStyle = C.frameSoft
  ctx.lineWidth = 3
  ctx.strokeRect(46, 46, DESIGN_W - 92, DESIGN_H - 92)

  ctx.save()
  ctx.strokeStyle = C.frame
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.setLineDash([1, 9])
  ctx.strokeRect(58, 58, DESIGN_W - 116, DESIGN_H - 116)
  ctx.restore()

  const corners: [number, number][] = [
    [46, 46],
    [DESIGN_W - 46, 46],
    [46, DESIGN_H - 46],
    [DESIGN_W - 46, DESIGN_H - 46],
  ]
  for (const [cx, cy] of corners) {
    ctx.beginPath()
    ctx.arc(cx, cy, 24, 0, Math.PI * 2)
    ctx.fillStyle = C.bgTop
    ctx.fill()
    drawRosette(ctx, cx, cy, 32, 8, C.petal, C.frame)
  }
}

function drawBanner(ctx: Ctx) {
  const path = (dy: number) => {
    ctx.beginPath()
    ctx.moveTo(190, 84 + dy)
    ctx.lineTo(933, 84 + dy)
    ctx.lineTo(903, 127 + dy)
    ctx.lineTo(933, 170 + dy)
    ctx.lineTo(190, 170 + dy)
    ctx.lineTo(220, 127 + dy)
    ctx.closePath()
  }
  // ظل مسطّح
  path(7)
  ctx.fillStyle = C.frameSoft
  ctx.fill()
  // الشريط
  const g = ctx.createLinearGradient(0, 84, 0, 170)
  g.addColorStop(0, C.frame)
  g.addColorStop(1, C.frameDark)
  path(0)
  ctx.fillStyle = g
  ctx.fill()
  // خياطة بيضاء متقطعة
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'
  ctx.lineWidth = 2
  ctx.setLineDash([8, 6])
  ctx.strokeRect(248, 95, DESIGN_W - 496, 64)
  ctx.restore()

  drawText(ctx, 'شهادة شكر وتقدير', CX, 131, 62, 800, '#ffffff', 540)
}

function drawDivider(ctx: Ctx, y: number) {
  ctx.strokeStyle = C.frameSoft
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  for (const [x1, x2] of [
    [330, 520],
    [603, 793],
  ]) {
    ctx.beginPath()
    ctx.moveTo(x1, y)
    ctx.lineTo(x2, y)
    ctx.stroke()
  }
  for (const x of [330, 793]) {
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = C.frame
    ctx.fill()
  }
  drawRosette(ctx, CX, y, 16, 6, C.petalDeep, C.frameDark)
}

function drawSeal(ctx: Ctx, cx: number, cy: number) {
  // شريطا الميدالية
  for (const dir of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(cx + dir * 4, cy + 20)
    ctx.lineTo(cx + dir * 28, cy + 20)
    ctx.lineTo(cx + dir * 28, cy + 62)
    ctx.lineTo(cx + dir * 16, cy + 52)
    ctx.lineTo(cx + dir * 4, cy + 62)
    ctx.closePath()
    ctx.fillStyle = dir === -1 ? C.frameDark : C.name
    ctx.fill()
  }
  // الختم المسنَّن
  ctx.beginPath()
  for (let i = 0; i < 48; i++) {
    const a = (i * Math.PI) / 24
    const rad = i % 2 === 0 ? 36 : 32
    const x = cx + Math.cos(a) * rad
    const y = cy + Math.sin(a) * rad
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  const g = ctx.createRadialGradient(cx - 9, cy - 9, 4, cx, cy, 38)
  g.addColorStop(0, C.petalDeep)
  g.addColorStop(1, C.frameDark)
  ctx.fillStyle = g
  ctx.fill()

  ctx.beginPath()
  ctx.arc(cx, cy, 26, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 2
  ctx.stroke()
  drawStar(ctx, cx, cy + 1, 15, '#ffffff')
}

function drawInfoBlock(ctx: Ctx, x: number, label: string, value: string) {
  drawText(ctx, label, x, 652, 22, 400, C.soft, 300)
  drawText(ctx, value, x, 692, 28, 700, C.title, 300)
}

async function drawCertificate(opts: CertificateOptions): Promise<HTMLCanvasElement> {
  await Promise.all([400, 700, 800].map((w) => document.fonts.load(`${w} 40px Tajawal`, GLYPHS)))

  const scale = CANVAS_W / DESIGN_W
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_W
  canvas.height = Math.round(DESIGN_H * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas غير مدعوم')
  ctx.scale(scale, scale)
  ctx.direction = 'rtl'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  drawBackground(ctx)
  drawFrame(ctx)
  drawBanner(ctx)
  drawDivider(ctx, 208)

  // لوحة بيضاء شفافة تُبقي النص واضحاً فوق النقش
  roundRectPath(ctx, 110, 234, DESIGN_W - 220, 388, 28)
  ctx.fillStyle = 'rgba(255,255,255,0.74)'
  ctx.fill()

  drawText(ctx, 'يسرّنا أن نتقدّم بخالص الشكر والتقدير للطالبة المتميزة', CX, 268, 32, 400, C.text, 800)

  // الاسم
  drawText(ctx, opts.name, CX, 342, 84, 800, C.name, 700)
  const line = ctx.createLinearGradient(200, 0, DESIGN_W - 200, 0)
  line.addColorStop(0, 'rgba(236,72,153,0)')
  line.addColorStop(0.5, C.frame)
  line.addColorStop(1, 'rgba(236,72,153,0)')
  ctx.strokeStyle = line
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(200, 388)
  ctx.lineTo(DESIGN_W - 200, 388)
  ctx.stroke()
  drawRosette(ctx, CX, 388, 11, 6, C.petalDeep, C.frameDark)

  drawText(ctx, 'على جهدها ومثابرتها في مادة لغتي،', CX, 436, 32, 400, C.text, 800)
  drawText(ctx, 'وتهنئةً لها على اجتيازها بنجاح', CX, 478, 32, 400, C.text, 800)

  // اسم الاختبار داخل شريحة
  const size = fitFont(ctx, opts.examTitle, 44, 700, 740)
  const w = ctx.measureText(opts.examTitle).width + 80
  roundRectPath(ctx, CX - w / 2, 505, w, 66, 33)
  ctx.fillStyle = C.pillBg
  ctx.fill()
  ctx.strokeStyle = C.frameSoft
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.font = `700 ${size}px ${FONT}`
  ctx.fillStyle = C.title
  ctx.fillText(opts.examTitle, CX, 539)

  drawText(ctx, 'سائلين الله لها دوام التوفيق والتميّز، وأن يزيدها علماً ونوراً.', CX, 598, 28, 400, C.soft, 800)

  // أسفل الشهادة: المادة، الختم، التاريخ
  drawSeal(ctx, CX, 668)
  drawInfoBlock(ctx, DESIGN_W - 250, 'المادة', 'لغتي، الصف السادس الابتدائي')
  drawInfoBlock(ctx, 250, 'التاريخ', formatDate(opts.date ?? new Date()))

  return canvas
}

/** يغلّف صورة JPEG في ملف PDF من صفحة واحدة بحجم A4 أفقي */
function wrapJpegInPdf(jpeg: Uint8Array, width: number, height: number): Blob {
  const enc = new TextEncoder()
  const chunks: Uint8Array[] = []
  const offsets: number[] = []
  let pos = 0
  const push = (d: Uint8Array | string) => {
    const b = typeof d === 'string' ? enc.encode(d) : d
    chunks.push(b)
    pos += b.length
  }
  const obj = (n: number, body: string) => {
    offsets[n] = pos
    push(`${n} 0 obj\n${body}\nendobj\n`)
  }

  push('%PDF-1.4\n')
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>')
  obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>')
  obj(
    3,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_W} ${PDF_H}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
  )
  offsets[4] = pos
  push(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  )
  push(jpeg)
  push('\nendstream\nendobj\n')
  const content = `q ${PDF_W} 0 0 ${PDF_H} 0 0 cm /Im0 Do Q`
  obj(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`)

  const xrefPos = pos
  push('xref\n0 6\n0000000000 65535 f \n')
  for (let i = 1; i <= 5; i++) push(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`)
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`)

  return new Blob(chunks as BlobPart[], { type: 'application/pdf' })
}

export async function buildCertificatePdf(opts: CertificateOptions): Promise<Blob> {
  const canvas = await drawCertificate(opts)
  const jpegBlob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('تعذّر تحويل الصورة'))), 'image/jpeg', 0.92),
  )
  const bytes = new Uint8Array(await jpegBlob.arrayBuffer())
  return wrapJpegInPdf(bytes, canvas.width, canvas.height)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}