import type { ChoiceQuestion } from '../../types'
import { shuffled } from '../../lib/random'
import { choiceQ } from '../helpers'

export interface MadhItem {
  verb: 'نِعْمَ' | 'بِئْسَ'
  doer: string
  special: string
}

export const madhItems: MadhItem[] = [
  { verb: 'نِعْمَ', doer: 'الطَّالِبُ', special: 'عَلِيٌّ' },
  { verb: 'نِعْمَ', doer: 'الخُلُقُ', special: 'التَّضْحِيَةُ' },
  { verb: 'بِئْسَ', doer: 'الصِّفَةُ', special: 'النِّفَاقُ' },
  { verb: 'بِئْسَ', doer: 'الخُلُقُ', special: 'الكَذِبُ' },
  { verb: 'نِعْمَ', doer: 'الرَّفِيقُ', special: 'الكِتَابُ' },
  { verb: 'نِعْمَ', doer: 'القُدْوَةُ', special: 'أَبُو بَكْرٍ' },
  { verb: 'بِئْسَ', doer: 'العَادَةُ', special: 'التَّأَخُّرُ' },
  { verb: 'نِعْمَ', doer: 'العَمَلُ', special: 'التَّعَاوُنُ' },
  { verb: 'بِئْسَ', doer: 'الطَّبْعُ', special: 'الغُرُورُ' },
  { verb: 'نِعْمَ', doer: 'الأَخُ', special: 'مُحَمَّدٌ' },
  { verb: 'بِئْسَ', doer: 'الخُلُقُ', special: 'الغِشُّ' },
  { verb: 'نِعْمَ', doer: 'الخُلُقُ', special: 'الصِّدْقُ' },
]

export const madhSentence = (m: MadhItem) => `${m.verb} ${m.doer} ${m.special}`

/** صور ما بعد نعم وبئس كما في الكتاب (ص٤٩) */
const forms = [
  { s: 'نِعْمَ الصَّدِيقُ الوَفِيُّ', t: 'معرَّف بـ(ال)' },
  { s: 'نِعْمَ صَدِيقُ الإِنْسَانِ الوَفِيُّ', t: 'مضاف إلى معرَّف بـ(ال)' },
  { s: 'نِعْمَ صَدِيقًا الوَفِيُّ', t: 'نكرة' },
]

export function makeMadhQuestion(): ChoiceQuestion {
  const i = shuffled(madhItems.map((_, k) => k))[0]
  const m = madhItems[i]
  const s = madhSentence(m)
  const isPraise = m.verb === 'نِعْمَ'
  const kind = isPraise ? 'مدح' : 'ذم'
  const other = isPraise ? 'ذم' : 'مدح'
  const word = isPraise ? 'المدح' : 'الذم'
  const type = shuffled(['kind', 'doer', 'special', 'verb', 'form'])[0]

  if (type === 'form') {
    const f = forms[shuffled([0, 1, 2])[0]]
    return choiceQ(
      `mdh-f${forms.indexOf(f)}`,
      `في **${f.s}**، الكلمة اللي بعد «نِعْمَ» جاءت:`,
      [f.t, 'صح!'],
      forms
        .filter((x) => x !== f)
        .map((x): [string, string] => [x.t, `هاي صورة ثانية، مثالها: ${x.s}.`]),
    )
  }

  if (type === 'doer') {
    return choiceQ(
      `mdh-${i}-d`,
      `ما **فاعل** «${m.verb}» في الجملة: **${s}**؟`,
      [m.doer, `صح! الفاعل هو الكلمة اللي بتجي مباشرة بعد «${m.verb}».`],
      [
        [m.special, `«${m.special}» هو **المخصوص ب${word}**، مش الفاعل.`],
        [m.verb, `«${m.verb}» هو **فعل ${word}** نفسه، مش الفاعل.`],
      ],
    )
  }

  if (type === 'special') {
    return choiceQ(
      `mdh-${i}-s`,
      `ما **المخصوص ب${word}** في الجملة: **${s}**؟`,
      [m.special, `صح! هو اللي نقصد مدحه أو ذمّه، وبيجي بعد الفاعل.`],
      [
        [m.doer, `«${m.doer}» هو **الفاعل** مش المخصوص.`],
        [m.verb, `«${m.verb}» هو **فعل ${word}**.`],
      ],
    )
  }

  if (type === 'verb') {
    return choiceQ(
      `mdh-${i}-v`,
      `أي فعل بيناسب الجملة؟ **□ ${m.doer} ${m.special}**`,
      [m.verb, `صح! المعنى هون ${kind}، فبنستعمل «${m.verb}».`],
      [
        [isPraise ? 'بِئْسَ' : 'نِعْمَ', `هاد فعل ${other}، والمعنى هون ${kind}.`],
        ['لَيْسَ', '«لَيْسَ» فعل نفي، مش مدح ولا ذم.'],
      ],
    )
  }

  return choiceQ(
    `mdh-${i}-k`,
    `الجملة **${s}** هي أسلوب...؟`,
    [kind, `صح! «${m.verb}» بتُستعمل لل${kind}.`],
    [
      [other, `لا، «${m.verb}» ما بتُستعمل لل${other}.`],
      ['تعجب', `التعجب بصيغة «ما أَفْعَلَهُ»، وهاي الجملة فيها «${m.verb}».`],
    ],
  )
}