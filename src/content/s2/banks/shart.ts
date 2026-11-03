import type { Question } from '../../../types'
import type { SortBucket, SortItem } from '../../../widgets/SortWidget'
import { choiceQ, makeSortItems } from '../../helpers'
import { pick } from '../../../lib/random'

interface Shart {
  text: string
  adat: string
  shart: string
  jawab: string
  other?: string
}

export const SHART_SENTENCES: Shart[] = [
  { text: 'إِنْ تَجْتَهِدْ تَنْجَحْ', adat: 'إِنْ', shart: 'تَجْتَهِدْ', jawab: 'تَنْجَحْ' },
  { text: 'مَنْ يَزْرَعْ يَحْصُدْ', adat: 'مَنْ', shart: 'يَزْرَعْ', jawab: 'يَحْصُدْ' },
  { text: 'إِنْ تَنَمْ مُبَكِّرًا تَسْتَيْقِظْ نَشِيطًا', adat: 'إِنْ', shart: 'تَنَمْ', jawab: 'تَسْتَيْقِظْ', other: 'نَشِيطًا' },
  { text: 'مَنْ يَغْسِلْ يَدَيْهِ يَحْمِ نَفْسَهُ', adat: 'مَنْ', shart: 'يَغْسِلْ', jawab: 'يَحْمِ', other: 'يَدَيْهِ' },
  { text: 'إِنْ تُهْمِلْ أَسْنَانَكَ تَتَسَوَّسْ', adat: 'إِنْ', shart: 'تُهْمِلْ', jawab: 'تَتَسَوَّسْ', other: 'أَسْنَانَكَ' },
  { text: 'مَنْ يَتَعَلَّمْ يَرْتَفِعْ شَأْنُهُ', adat: 'مَنْ', shart: 'يَتَعَلَّمْ', jawab: 'يَرْتَفِعْ', other: 'شَأْنُهُ' },
  { text: 'إِنْ تَقْرَأْ كُتُبًا نَافِعَةً تَسْتَفِدْ', adat: 'إِنْ', shart: 'تَقْرَأْ', jawab: 'تَسْتَفِدْ', other: 'كُتُبًا' },
  { text: 'مَنْ يَأْكُلْ طَعَامًا فَاسِدًا يَمْرَضْ', adat: 'مَنْ', shart: 'يَأْكُلْ', jawab: 'يَمْرَضْ', other: 'طَعَامًا' },
  { text: 'إِنْ تَصْدُقْ تَنْجُ', adat: 'إِنْ', shart: 'تَصْدُقْ', jawab: 'تَنْجُ' },
  { text: 'مَنْ يَسْعَ فِي الخَيْرِ يَنَلْ مَحَبَّةَ الجَمِيعِ', adat: 'مَنْ', shart: 'يَسْعَ', jawab: 'يَنَلْ', other: 'مَحَبَّةَ' },
]

type Role = 'adat' | 'shart' | 'jawab' | 'other'

const ROLE_WHY: Record<Role, (w: string) => string> = {
  adat: (w) => `«${w}» أداة الشرط: الكلمة اللي بتفتح الأسلوب.`,
  shart: (w) => `«${w}» فعل الشرط: الفعل اللي بييجي بعد الأداة مباشرة.`,
  jawab: (w) => `«${w}» جواب الشرط: النتيجة اللي بتحصل لما يتحقق الشرط.`,
  other: (w) => `«${w}» كلمة مكمّلة للجملة، مش من أركان الشرط الثلاثة.`,
}
const ROLE_LABEL: Record<Exclude<Role, 'other'>, string> = {
  adat: 'أداة الشرط',
  shart: 'فعل الشرط',
  jawab: 'جواب الشرط',
}

export function makeShartQuestion(): Question {
  const s = pick(SHART_SENTENCES)
  const role = pick(['adat', 'shart', 'jawab'] as const)
  const others = (['adat', 'shart', 'jawab'] as const).filter((r) => r !== role)
  const wrongRoles: Role[] = s.other ? [pick(others), 'other'] : [...others]
  const wrongWord = (r: Role) => (r === 'other' ? s.other! : s[r])
  return choiceQ(
    `s2-shart-${role}-${s.text}`,
    `في جملة الشرط: «${s.text}»\nما **${ROLE_LABEL[role]}**؟`,
    [s[role], `صح! ${ROLE_WHY[role](s[role])}`],
    wrongRoles.map((r) => [wrongWord(r), ROLE_WHY[r](wrongWord(r))] as [string, string]),
  )
}

export const SHART_BUCKETS: SortBucket[] = [
  { id: 'adat', label: 'أداة الشرط', emoji: '🔑' },
  { id: 'shart', label: 'فعل الشرط', emoji: '1️⃣' },
  { id: 'jawab', label: 'جواب الشرط', emoji: '2️⃣' },
]

export function shartSortItems(indices: number[]): SortItem[] {
  const rows: [string, string, string][] = []
  indices.forEach((i, n) => {
    const s = SHART_SENTENCES[i]
    const role = (['adat', 'shart', 'jawab'] as const)[n % 3]
    rows.push([`«${s[role]}» من: ${s.text}`, role, ROLE_WHY[role](s[role])])
  })
  return makeSortItems(SHART_BUCKETS, rows)
}