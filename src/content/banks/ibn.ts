import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import { pick } from '../../lib/random'
import { choiceQ, makeSortItems } from '../helpers'

type IbnReason = 'names' | 'nida' | 'start' | 'notNames' | 'secondNotFather'

export interface IbnEntry {
  before: string
  /** كلمة (ابن/ابنة) بلا همزة وبحركة إعرابها */
  ibn: string
  after: string
  /** هل تثبت الهمزة؟ */
  keep: boolean
  reason: IbnReason
  /** عبارة قصيرة للتصنيف وللتمييز بين الأسئلة */
  short: string
  fem?: boolean
}

const REASON: Record<IbnReason, string> = {
  names: 'وقعت بين علمين (اسمين) ثانيهما أب للأول، وما جاءت أول السطر',
  nida: 'جاءت بعد (يا) النداء',
  start: 'جاءت أول الجملة، وما وقعت بين علمين',
  notNames: 'ما وقعت بين علمين ثانيهما أب للأول',
  secondNotFather: 'ما بعدها «أخي المعلمة» وليس اسم أبيه، والشرط أن يكون العلم الثاني أباً للأول',
}

const e = (
  keep: boolean,
  reason: IbnReason,
  short: string,
  before: string,
  ibn: string,
  after: string,
  fem = false,
): IbnEntry => ({ keep, reason, short, before, ibn, after, fem })

export const IBN_BANK: IbnEntry[] = [
  // تُحذف
  e(false, 'names', 'الخَلِيفَةِ عُمَرَ (ـــ) الخَطَّابِ', 'فُتِحَتْ مِصْرُ فِي عَهْدِ الخَلِيفَةِ عُمَرَ', 'بْنِ', 'الخَطَّابِ.'),
  e(false, 'names', 'خَالِدُ (ـــ) الوَلِيدِ', 'كَانَ خَالِدُ', 'بْنُ', 'الوَلِيدِ قَائِداً شُجَاعاً.'),
  e(false, 'names', 'أَنَسُ (ـــ) مَالِكٍ', 'رَوَى أَنَسُ', 'بْنُ', 'مَالِكٍ أَحَادِيثَ كَثِيرَةً.'),
  e(false, 'names', 'طَارِقُ (ـــ) زِيَادٍ', 'قَادَ طَارِقُ', 'بْنُ', 'زِيَادٍ الجَيْشَ.'),
  e(false, 'names', 'عُمَرُ (ـــ) عَبْدِ العَزِيزِ', 'مِنْ أَشْهَرِ الخُلَفَاءِ عُمَرُ', 'بْنُ', 'عَبْدِ العَزِيزِ.'),
  e(false, 'names', 'عَبْدُ اللهِ (ـــ) عَبَّاسٍ', 'تَعَلَّمْتُ مِنْ سِيرَةِ عَبْدِ اللهِ', 'بْنِ', 'عَبَّاسٍ.'),
  e(false, 'nida', 'يَا (ـــ) آدَمَ', 'يَا', 'بْنَ', 'آدَمَ، اتَّقِ النَّارَ.'),
  e(false, 'nida', 'يَا (ـــ) أَخِي', 'يَا', 'بْنَ', 'أَخِي، اسْمَعْ نَصِيحَتِي.'),
  e(false, 'nida', 'يَا (ـــ) عَمِّي', 'يَا', 'بْنَ', 'عَمِّي، تَعَالَ مَعِي.'),
  // تثبت
  e(true, 'start', '(ـــ) سِينَا طَبِيبٌ', '', 'بْنُ', 'سِينَا طَبِيبٌ مَشْهُورٌ.'),
  e(true, 'start', '(ـــ) تَيْمِيَّةَ عَالِمٌ', '', 'بْنُ', 'تَيْمِيَّةَ عَالِمٌ جَلِيلٌ.'),
  e(true, 'notNames', 'رَأَيْتُ (ـــ) عَمِّي', 'رَأَيْتُ', 'بْنَ', 'عَمِّي فِي السُّوقِ.'),
  e(true, 'notNames', 'هَذَا (ـــ) جَارِي', 'هَذَا', 'بْنُ', 'جَارِي.'),
  e(true, 'notNames', 'سَلَّمَ عَلَيْنَا (ـــ) خَالَتِي', 'سَلَّمَ عَلَيْنَا', 'بْنُ', 'خَالَتِي.'),
  e(true, 'secondNotFather', 'مُحَمَّدٌ (ـــ) أَخِي المُعَلِّمَةِ', 'سَلَّمَ عَلَيْنَا مُحَمَّدٌ', 'بْنُ', 'أَخِي المُعَلِّمَةِ.'),
  e(true, 'notNames', 'أُحِبُّ (ـــ) جِيرَانِنَا', 'أُحِبُّ', 'بْنَةَ', 'جِيرَانِنَا.', true),
  e(true, 'notNames', 'نَجَحَتْ (ـــ) خَالَتِي', 'نَجَحَتْ', 'بْنَةُ', 'خَالَتِي فِي الِاخْتِبَارِ.', true),
]

const join = (...parts: string[]): string => parts.filter(Boolean).join(' ')
const sentence = (x: IbnEntry, withHamza: boolean): string => join(x.before, withHamza ? `ا${x.ibn}` : x.ibn, x.after)
const blank = (x: IbnEntry): string => join(x.before, '(ـــ)', x.after)
const word = (x: IbnEntry): string => (x.fem ? 'ابنة' : 'ابن')
const verdict = (x: IbnEntry): string => (x.keep ? 'تُثبت الهمزة' : 'تُحذف الهمزة')
const reasonText = (x: IbnEntry): string => `${REASON[x.reason]}، فـ${verdict(x)}.`

export function ibnDecisionQuestion(x: IbnEntry): Question {
  return choiceQ(
    `ibn-d-${x.short}`,
    `في الجملة: **${blank(x)}**\nهمزة كلمة (${word(x)}) هنا:`,
    [verdict(x), `${reasonText(x)}`],
    [[x.keep ? 'تُحذف الهمزة' : 'تُثبت الهمزة', `${reasonText(x)} يعني مش هيك.`]],
  )
}

/** للكلمات غير المؤنثة فقط، حتى لا تُعرض صورة «بنة» الخاطئة */
export function ibnSpellingQuestion(x: IbnEntry): Question {
  return choiceQ(
    `ibn-s-${x.short}`,
    `أيّ الجملتين مكتوبة كتابة صحيحة؟\n(${x.short})`,
    [sentence(x, x.keep), `${reasonText(x)}`],
    [[sentence(x, !x.keep), `${reasonText(x)} فهذه الكتابة غير صحيحة.`]],
  )
}

export function makeIbnQuestion(): Question {
  const x = pick(IBN_BANK)
  return x.fem || Math.random() < 0.6 ? ibnDecisionQuestion(x) : ibnSpellingQuestion(x)
}

export const IBN_BUCKETS = [
  { id: 'del', label: 'تُحذف', emoji: '✂️' },
  { id: 'keep', label: 'تثبت', emoji: '📌' },
]

export function ibnSortItems(shorts: string[]): SortItem[] {
  return makeSortItems(
    IBN_BUCKETS,
    shorts.map((s): [string, string, string] => {
      const x = IBN_BANK.find((b) => b.short === s)
      if (!x) throw new Error(`عبارة غير موجودة في بنك ابن: ${s}`)
      return [x.short, x.keep ? 'keep' : 'del', reasonText(x)]
    }),
  )
}