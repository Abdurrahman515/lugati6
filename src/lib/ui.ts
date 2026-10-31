import { useSyncExternalStore } from 'react'

const KEY = 'lugha-app:ui:v1'

interface UiState {
  collapsed: Record<string, boolean>
}

function load(): UiState {
  try {
    const text = localStorage.getItem(KEY)
    if (text) {
      const raw = JSON.parse(text) as Partial<UiState>
      if (raw && typeof raw.collapsed === 'object' && raw.collapsed !== null) {
        return { collapsed: raw.collapsed }
      }
    }
  } catch {
    /* نتجاهل */
  }
  return { collapsed: {} }
}

let cache: UiState | null = null
const listeners = new Set<() => void>()

function getUi(): UiState {
  if (!cache) cache = load()
  return cache
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function setCollapsed(id: string, value: boolean): void {
  const next: UiState = { collapsed: { ...getUi().collapsed, [id]: value } }
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* نتجاهل */
  }
  listeners.forEach((l) => l())
}

export function useCollapsed(id: string, defaultValue: boolean): [boolean, () => void] {
  const ui = useSyncExternalStore(subscribe, getUi)
  const collapsed = ui.collapsed[id] ?? defaultValue
  return [collapsed, () => setCollapsed(id, !collapsed)]
}