import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCollapsed } from '../lib/ui'

export function Collapsible({
  id,
  title,
  emoji,
  subtitle,
  defaultCollapsed,
  children,
}: {
  id: string
  title: string
  emoji?: string
  subtitle?: string
  defaultCollapsed: boolean
  children: ReactNode
}) {
  const [collapsed, toggle] = useCollapsed(id, defaultCollapsed)
  return (
    <section className="fold">
      <button className="fold-head" onClick={toggle} aria-expanded={!collapsed}>
        <span className="fold-title">
          {emoji} {title}
        </span>
        {subtitle && <span className="fold-sub">{subtitle}</span>}
        <ChevronDown className={`chev ${collapsed ? '' : 'open'}`} size={22} />
      </button>
      {!collapsed && <div className="fold-body">{children}</div>}
    </section>
  )
}