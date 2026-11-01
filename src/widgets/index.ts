import type { ComponentType } from 'react'
import type { WidgetProps } from '../types'
import { SortWidget } from './SortWidget'
import { OrderWidget } from './OrderWidget'
import { ScanWidget } from './ScanWidget'
import { DuelWidget } from './DuelWidget'

/** أي أداة جديدة تُسجَّل هنا بمعرّف نصي، وإلا لا يستدعيها الدرس */
export const widgets: Record<string, ComponentType<WidgetProps>> = {
  sort: SortWidget,
  order: OrderWidget,
  scan: ScanWidget,
  duel: DuelWidget,
}