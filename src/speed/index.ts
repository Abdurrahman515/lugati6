import type { SpeedTool } from '../lib/speed'
import { imlaMakers } from './imla'
import { irabMakers } from './irab'
import { sarfMakers } from './sarf'

export const speedTools: SpeedTool[] = [
  {
    id: 'speed-irab',
    title: 'سرعة الإعراب',
    emoji: '✍️',
    blurb: 'علامات الإعراب وحالات الكلمة، بسرعة وبلا تفكير طويل.',
    makers: irabMakers,
  },
  {
    id: 'speed-imla',
    title: 'سرعة الإملاء',
    emoji: '📝',
    blurb: 'همزة الوصل والقطع، وكرسي الهمزة، والتنوين، والألف اللينة.',
    makers: imlaMakers,
  },
  {
    id: 'speed-sarf',
    title: 'سرعة الصرف',
    emoji: '🧩',
    blurb: 'الوزن الصرفي والمشتقات: فاعل ومفعول وآلة وزمان ومكان ومصدر.',
    makers: sarfMakers,
  },
]

export const findSpeedTool = (id: string) => speedTools.find((t) => t.id === id)