/** أدوات عشوائية صغيرة لبنوك الفصل الثاني. تُستدعى عند توليد السؤال فقط، لا أثناء الرسم. */
export function pickOne<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function shuffled<T>(items: readonly T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}