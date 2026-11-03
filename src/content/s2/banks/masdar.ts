import type { ChoiceQuestion } from '../../../types'
import type { SortBucket, SortData } from '../../../widgets/SortWidget'
import { choiceQ, makeSortItems } from '../../helpers'
import { pick } from '../../../lib/random'

type W = 'tafil' | 'ifaal' | 'iftial' | 'istifal'

interface M {
  verb: string
  mas: string
  fa: string
  mf: string
  w?: W
}

const m = (verb: string, mas: string, fa: string, mf: string, w?: W): M => ({ verb, mas, fa, mf, w })

const MASDAR: M[] = [
  m('كَتَبَ', 'كِتَابَة', 'كَاتِب', 'مَكْتُوب'),
  m('فَتَحَ', 'فَتْح', 'فَاتِح', 'مَفْتُوح'),
  m('حَفِظَ', 'حِفْظ', 'حَافِظ', 'مَحْفُوظ'),
  m('شَكَرَ', 'شُكْر', 'شَاكِر', 'مَشْكُور'),
  m('فَهِمَ', 'فَهْم', 'فَاهِم', 'مَفْهُوم'),
  m('أَكَلَ', 'أَكْل', 'آكِل', 'مَأْكُول'),
  m('كَبَّرَ', 'تَكْبِير', 'مُكَبِّر', 'مُكَبَّر', 'tafil'),
  m('عَلَّمَ', 'تَعْلِيم', 'مُعَلِّم', 'مُعَلَّم', 'tafil'),
  m('نَظَّفَ', 'تَنْظِيف', 'مُنَظِّف', 'مُنَظَّف', 'tafil'),
  m('قَسَّمَ', 'تَقْسِيم', 'مُقَسِّم', 'مُقَسَّم', 'tafil'),
  m('أَكْرَمَ', 'إِكْرَام', 'مُكْرِم', 'مُكْرَم', 'ifaal'),
  m('أَرْشَدَ', 'إِرْشَاد', 'مُرْشِد', 'مُرْشَد', 'ifaal'),
  m('أَنْقَذَ', 'إِنْقَاذ', 'مُنْقِذ', 'مُنْقَذ', 'ifaal'),
  m('أَخْبَرَ', 'إِخْبَار', 'مُخْبِر', 'مُخْبَر', 'ifaal'),
  m('انْتَقَلَ', 'انْتِقَال', 'مُنْتَقِل', 'مُنْتَقَل', 'iftial'),
  m('احْتَرَمَ', 'احْتِرَام', 'مُحْتَرِم', 'مُحْتَرَم', 'iftial'),
  m('انْتَظَرَ', 'انْتِظَار', 'مُنْتَظِر', 'مُنْتَظَر', 'iftial'),
  m('اكْتَشَفَ', 'اكْتِشَاف', 'مُكْتَشِف', 'مُكْتَشَف', 'iftial'),
  m('اسْتَقْبَلَ', 'اسْتِقْبَال', 'مُسْتَقْبِل', 'مُسْتَقْبَل', 'istifal'),
  m('اسْتَخْدَمَ', 'اسْتِخْدَام', 'مُسْتَخْدِم', 'مُسْتَخْدَم', 'istifal'),
  m('اسْتَهْلَكَ', 'اسْتِهْلَاك', 'مُسْتَهْلِك', 'مُسْتَهْلَك', 'istifal'),
  m('اسْتَفْهَمَ', 'اسْتِفْهَام', 'مُسْتَفْهِم', 'مُسْتَفْهَم', 'istifal'),
]

const MASDAR_WAZN: Record<W, string> = { tafil: 'تَفْعِيل', ifaal: 'إِفْعَال', iftial: 'افْتِعَال', istifal: 'اسْتِفْعَال' }
const VERB_WAZN: Record<W, string> = { tafil: 'فَعَّلَ', ifaal: 'أَفْعَلَ', iftial: 'افْتَعَلَ', istifal: 'اسْتَفْعَلَ' }
const EXAMPLE: Record<W, string> = {
  tafil: 'كَبَّرَ ← تَكْبِير',
  ifaal: 'أَكْرَمَ ← إِكْرَام',
  iftial: 'انْتَقَلَ ← انْتِقَال',
  istifal: 'اسْتَفْهَمَ ← اسْتِفْهَام',
}

/** ما مصدر الفعل؟ (الخيارات الخاطئة: اسم الفاعل واسم المفعول) */
export function makeMasdarQuestion(): ChoiceQuestion {
  const x = pick(MASDAR)
  return choiceQ(
    `s2-masdar-${MASDAR.indexOf(x)}`,
    `ما مصدر الفعل «**${x.verb}**»؟`,
    [x.mas, `صح! «${x.mas}» بيدل على الحدث مجرداً من الزمن، وبيقبل «ال»: ال${x.mas}.`],
    [
      [x.fa, `«${x.fa}» اسم فاعل: بيدل على الحدث وعلى اللي قام فيه، مش على الحدث وحده.`],
      [x.mf, `«${x.mf}» اسم مفعول: بيدل على اللي وقع عليه الفعل، مش على الحدث وحده.`],
    ],
  )
}

const NON_TRI = MASDAR.filter((x) => x.w)

/** وزن مصدر الفعل غير الثلاثي */
export function makeMasdarWaznQuestion(): ChoiceQuestion {
  const x = pick(NON_TRI)
  const w = x.w as W
  return choiceQ(
    `s2-masdarw-${MASDAR.indexOf(x)}`,
    `ما وزن المصدر «**${x.mas}**» (من الفعل «${x.verb}»)؟`,
    [MASDAR_WAZN[w], `صح! الفعل «${x.verb}» على وزن ${VERB_WAZN[w]}، فمصدره على وزن ${MASDAR_WAZN[w]}.`],
    (Object.keys(MASDAR_WAZN) as W[])
      .filter((k) => k !== w)
      .map((k): [string, string] => [
        MASDAR_WAZN[k],
        `${MASDAR_WAZN[k]} هو وزن مصدر الفعل على وزن ${VERB_WAZN[k]} (${EXAMPLE[k]})، أما «${x.verb}» فعلى وزن ${VERB_WAZN[w]}.`,
      ]),
  )
}

/** أي كلمة تدل على الحدث وحده؟ (المصدر مقابل الفعل واسم الفاعل) */
export function makeMasdarVsVerbQuestion(): ChoiceQuestion {
  const x = pick(MASDAR)
  return choiceQ(
    `s2-masdarv-${MASDAR.indexOf(x)}`,
    `من بين هالكلمات المشتقة من الفعل «${x.verb}»، أيها يدل على الحدث وحده من غير زمن ولا فاعل؟`,
    [x.mas, `صح! المصدر بيدل على الحدث مجرداً من الزمن.`],
    [
      [x.verb, `«${x.verb}» فعل ماضٍ: فيه حدث وزمن.`],
      [x.fa, `«${x.fa}» اسم فاعل: فيه الحدث وصاحبه.`],
    ],
  )
}

const KIND_BUCKETS: SortBucket[] = [
  { id: 'mas', label: 'مصدر', emoji: '🧊' },
  { id: 'fi3l', label: 'فعل', emoji: '🏃' },
  { id: 'fa', label: 'اسم فاعل', emoji: '🙋' },
]

export const masdarKindSort: SortData = {
  prompt: 'مصدر ولا فعل ولا اسم فاعل؟ فكّري: هل بيدل على الحدث وحده؟ 🧐',
  buckets: KIND_BUCKETS,
  items: makeSortItems(KIND_BUCKETS, [
    ['الكِتَابَة', 'mas', 'اسم بيدل على الحدث وحده، وفيه «ال».'],
    ['كَتَبَ', 'fi3l', 'فعل ماضٍ فيه حدث وزمن.'],
    ['كَاتِب', 'fa', 'اسم فاعل: بيدل على اللي قام بالكتابة.'],
    ['الاسْتِمَاع', 'mas', 'اسم بيدل على الحدث وحده، وفيه «ال».'],
    ['اسْتَمَعَ', 'fi3l', 'فعل ماضٍ فيه حدث وزمن.'],
    ['مُسْتَمِع', 'fa', 'اسم فاعل: بيدل على اللي قام بالاستماع.'],
    ['الأَكْل', 'mas', 'اسم بيدل على الحدث وحده، وفيه «ال».'],
    ['أَكَلَ', 'fi3l', 'فعل ماضٍ فيه حدث وزمن.'],
    ['آكِل', 'fa', 'اسم فاعل: بيدل على اللي قام بالأكل.'],
  ]),
}

const MEANING_BUCKETS: SortBucket[] = [
  { id: 'hirfa', label: 'حرفة (فِعَالَة)', emoji: '🛠️' },
  { id: 'daa', label: 'داء (فُعَال)', emoji: '🤒' },
  { id: 'sawt', label: 'صوت (فُعَال / فَعِيل)', emoji: '🔊' },
  { id: 'lawn', label: 'لون (فُعْلَة)', emoji: '🎨' },
]

const WHY = {
  hirfa: 'على وزن فِعَالَة وبتدل على حرفة.',
  daa: 'على وزن فُعَال وبتدل على مرض.',
  sawt: 'بتدل على صوت (على وزن فُعَال أو فَعِيل).',
  lawn: 'على وزن فُعْلَة وبتدل على لون.',
}

const mrow = (text: string, id: keyof typeof WHY): [string, string, string] => [text, id, `«${text}» ${WHY[id]}`]

/** ضوابط المصدر الثلاثي (جدول ص١٢٤) */
export const masdarMeaningSort: SortData = {
  prompt: 'الكلمات دي مصادر أفعال ثلاثية. شو بتدل: حرفة ولا داء ولا صوت ولا لون؟ 🧠',
  buckets: MEANING_BUCKETS,
  items: makeSortItems(MEANING_BUCKETS, [
    mrow('زِرَاعَة', 'hirfa'),
    mrow('صِنَاعَة', 'hirfa'),
    mrow('تِجَارَة', 'hirfa'),
    mrow('زُكَام', 'daa'),
    mrow('صُدَاع', 'daa'),
    mrow('سُعَال', 'daa'),
    mrow('عُوَاء', 'sawt'),
    mrow('نُبَاح', 'sawt'),
    mrow('زَئِير', 'sawt'),
    mrow('صَهِيل', 'sawt'),
    mrow('خُضْرَة', 'lawn'),
    mrow('حُمْرَة', 'lawn'),
    mrow('زُرْقَة', 'lawn'),
  ]),
}