import type { ReactNode } from 'react'

const TOKEN = /(\*\*[^*]+\*\*|==[^=]+==)/g

export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = text.split(TOKEN).map((part, i) => {
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.length > 4 && part.startsWith('==') && part.endsWith('==')) {
      return <mark key={i}>{part.slice(2, -2)}</mark>
    }
    return part
  })
  return <span className="rich">{nodes}</span>
}