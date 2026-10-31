import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import { pick, shuffled } from '../../lib/random'

export type StyleKind =
  | 'nahy'
  | 'nafy'
  | 'taajjub'
  | 'istifham'
  | 'nida'
  | 'tamanni'
  | 'tarajji'
  | 'tafdil'
  | 'tawkid'
  | 'istithna'

export const STYLE_KINDS: StyleKind[] = [
  'nahy',
  'nafy',
  'taajjub',
  'istifham',
  'nida',
  'tamanni',
  'tarajji',
  'tafdil',
  'tawkid',
  'istithna',
]

export const STYLE_LABEL: Record<StyleKind, string> = {
  nahy: 'النهي',
  nafy: 'النفي',
  taajjub: 'التعجب',
  istifham: 'الاستفهام',
  nida: 'النداء',
  tamanni: 'التمني',
  tarajji: 'الترجي',
  tafdil: 'التفضيل',
  tawkid: 'التوكيد',
  istithna: 'الاستثناء',
}

export const STYLE_RULE: Record<StyleKind, string> = {
  nahy: 'النهي طلب الكف عن فعل، وأداته «لا» الناهية قبل الفعل المضارع.',
  nafy: 'النفي إنكار وقوع الفعل أو الحكم، وأدواته: لا، ما، لم، لن.',
  taajjub: 'التعجب انفعال بشي جميل أو غريب، وصيغته «ما أَفْعَلَهُ!».',
  istifham: 'الاستفهام طلب الفهم، وأدواته: هل، متى، أين، من...',
  nida: 'النداء تنبيه المخاطَب ليُقبل، وأداته «يا».',
  tamanni: 'التمني طلب أمر محبوب يصعب حصوله، وأداته «ليت».',
  tarajji: 'الترجي طلب أمر محبوب يُتوقع حصوله، وأداته «لعل».',
  tafdil: 'التفضيل مقارنة بين شيئين اشتركا بصفة وزاد فيها أحدهما، بصيغة «أَفْعَل» ثم «مِنْ».',
  tawkid: 'التوكيد تقوية المعنى وإزالة الشك، بكلمات مثل: كل، نفس.',
  istithna: 'الاستثناء إخراج ما بعد «إلّا» من حكم ما قبلها.',
}

export interface BankStyle {
  id: string
  s: string
  kind: StyleKind
  /** الأداة أو الصيغة التي تدل على الأسلوب */
  tool: string
}

const st = (id: string, s: string, kind: StyleKind, tool: string): BankStyle => ({ id, s, kind, tool })

export const STYLE_BANK: BankStyle[] = [
  st('s1', 'لا تُهْمِلْ وَاجِبَكَ', 'nahy', 'لا تُهْمِلْ'),
  st('s2', 'لا تَرْفَعْ صَوْتَكَ', 'nahy', 'لا تَرْفَعْ'),
  st('s3', 'لا تَأْكُلْ وَأَنْتَ تَتَكَلَّمُ', 'nahy', 'لا تَأْكُلْ'),
  st('s4', 'الصَّادِقُ لا يَكْذِبُ', 'nafy', 'لا يَكْذِبُ'),
  st('s5', 'مَا حَضَرَ الطَّالِبُ', 'nafy', 'مَا حَضَرَ'),
  st('s6', 'لَمْ يَنْجَحِ الكَسُولُ', 'nafy', 'لَمْ'),
  st('s7', 'لَنْ أَنْسَى فَضْلَكَ', 'nafy', 'لَنْ'),
  st('s8', 'مَا أَجْمَلَ الرَّبِيعَ!', 'taajjub', 'مَا أَجْمَلَ'),
  st('s9', 'مَا أَرْوَعَ الصِّدْقَ!', 'taajjub', 'مَا أَرْوَعَ'),
  st('s10', 'مَا أَحْلَى الصَّبَاحَ!', 'taajjub', 'مَا أَحْلَى'),
  st('s11', 'هَلْ حَضَرَ المُعَلِّمُ؟', 'istifham', 'هَلْ'),
  st('s12', 'مَتَى يَبْدَأُ الدَّرْسُ؟', 'istifham', 'مَتَى'),
  st('s13', 'أَيْنَ ذَهَبَ أَخُوكَ؟', 'istifham', 'أَيْنَ'),
  st('s14', 'مَنْ كَتَبَ هَذَا الدَّرْسَ؟', 'istifham', 'مَنْ'),
  st('s15', 'يَا مُحَمَّدُ، تَعَالَ', 'nida', 'يَا'),
  st('s16', 'يَا طَالِبَةَ العِلْمِ، اجْتَهِدِي', 'nida', 'يَا'),
  st('s17', 'يَا رَبِّ، اغْفِرْ لِي', 'nida', 'يَا'),
  st('s18', 'لَيْتَ العُطْلَةَ تَطُولُ', 'tamanni', 'لَيْتَ'),
  st('s19', 'لَيْتَ الصَّيْفَ يَعُودُ', 'tamanni', 'لَيْتَ'),
  st('s20', 'لَعَلَّ اللهَ يَشْفِي المَرِيضَ', 'tarajji', 'لَعَلَّ'),
  st('s21', 'لَعَلَّ المَطَرَ يَنْزِلُ', 'tarajji', 'لَعَلَّ'),
  st('s22', 'الفِيلُ أَكْبَرُ مِنَ الحِصَانِ', 'tafdil', 'أَكْبَرُ مِنَ'),
  st('s23', 'العِلْمُ أَنْفَعُ مِنَ المَالِ', 'tafdil', 'أَنْفَعُ مِنَ'),
  st('s24', 'حَضَرَ الطُّلَّابُ كُلُّهُمْ', 'tawkid', 'كُلُّهُمْ'),
  st('s25', 'قَرَأْتُ الكِتَابَ كُلَّهُ', 'tawkid', 'كُلَّهُ'),
  st('s26', 'حَضَرَ الطُّلَّابُ إِلَّا خَالِداً', 'istithna', 'إِلَّا'),
]

export function byStyleId(id: string): BankStyle {
  const found = STYLE_BANK.find((b) => b.id === id)
  if (!found) throw new Error(`الجملة غير موجودة في البنك: ${id}`)
  return found
}

const detail = (t: BankStyle): string => `فيها «${t.tool}»، وهذا أسلوب ${STYLE_LABEL[t.kind]}`

export function explainStyleWrong(target: BankStyle, picked: StyleKind): string {
  return `${STYLE_RULE[picked]} أما هالجملة ${detail(target)}.`
}

export function styleSortItems(ids: string[], buckets: StyleKind[]): SortItem[] {
  return ids.map((id) => {
    const b = byStyleId(id)
    const whyNot: Record<string, string> = {}
    for (const k of buckets) {
      if (k !== b.kind) whyNot[k] = explainStyleWrong(b, k)
    }
    return { text: b.s, bucket: b.kind, why: `${STYLE_LABEL[b.kind]}: ${detail(b)}.`, whyNot }
  })
}

export function makeStyleQuestion(): Question {
  const kind = pick(STYLE_KINDS)
  const target = pick(STYLE_BANK.filter((b) => b.kind === kind))
  const others = shuffled(STYLE_KINDS.filter((k) => k !== kind)).slice(0, 3)
  return {
    kind: 'choice',
    id: 'style-type',
    prompt: `ما الأسلوب اللغوي في هذه الجملة؟\n**${target.s}**`,
    choices: shuffled([kind, ...others]).map((k) =>
      k === kind
        ? { text: STYLE_LABEL[k], correct: true, why: `أحسنتِ! ${STYLE_LABEL[k]}: ${detail(target)}.` }
        : { text: STYLE_LABEL[k], why: explainStyleWrong(target, k) },
    ),
  }
}