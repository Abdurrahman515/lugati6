export function randomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

export function pick<T>(arr: readonly T[]): T {
  return arr[randomInt(arr.length)]
}

export function shuffled<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}