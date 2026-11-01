import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import { choiceQ, makeSortItems } from '../helpers'
import { pick } from '../../lib/random'

export interface DerivedVerb {
  verb: string
  faail: string
  mafool: string
}

const d = (verb: string, faail: string, mafool: string): DerivedVerb => ({ verb, faail, mafool })

/** أفعال ثلاثية صحيحة متعدية، اسم فاعلها على فاعل واسم مفعولها على مفعول */
export const DERIVED_BANK: DerivedVerb[] = [
  d('كَتَبَ', 'كَاتِب', 'مَكْتُوب'),
  d('دَرَسَ', 'دَارِس', 'مَدْرُوس'),
  d('فَتَحَ', 'فَاتِح', 'مَفْتُوح'),
  d('حَمَلَ', 'حَامِل', 'مَحْمُول'),
  d('نَصَرَ', 'نَاصِر', 'مَنْصُور'),
  d('عَلِمَ', 'عَالِم', 'مَعْلُوم'),
  d('رَسَمَ', 'رَاسِم', 'مَرْسُوم'),
  d('نَقَلَ', 'نَاقِل', 'مَنْقُول'),
  d('حَفِظَ', 'حَافِظ', 'مَحْفُوظ'),
  d('شَرِبَ', 'شَارِب', 'مَشْرُوب'),
  d('فَهِمَ', 'فَاهِم', 'مَفْهُوم'),
  d('طَبَعَ', 'طَابِع', 'مَطْبُوع'),
  d('غَرَسَ', 'غَارِس', 'مَغْرُوس'),
  d('خَلَقَ', 'خَالِق', 'مَخْلُوق'),
  d('سَمِعَ', 'سَامِع', 'مَسْمُوع'),
  d('ذَكَرَ', 'ذَاكِر', 'مَذْكُور'),
]

export function byDerived(verb: string): DerivedVerb {
  const found = DERIVED_BANK.find((b) => b.verb === verb)
  if (!found) throw new Error(`الفعل غير موجود في البنك: ${verb}`)
  return found
}

export const DERIVED_BUCKETS = [
  { id: 'faail', label: 'اسم فاعل', emoji: '🏃‍♀️' },
  { id: 'mafool', label: 'اسم مفعول', emoji: '🎯' },
]

export function derivedSortItems(rows: [string, 'faail' | 'mafool'][]): SortItem[] {
  return makeSortItems(
    DERIVED_BUCKETS,
    rows.map(([v, k]): [string, string, string] => {
      const x = byDerived(v)
      return k === 'faail'
        ? [x.faail, 'faail', `«${x.faail}» اسم فاعل من «${x.verb}»، على وزن فَاعِل: بيدل على اللي قام بالفعل.`]
        : [x.mafool, 'mafool', `«${x.mafool}» اسم مفعول من «${x.verb}»، على وزن مَفْعُول: بيدل على اللي وقع عليه الفعل.`]
    }),
  )
}

const FAAIL = 'فَاعِل'
const MAFOOL = 'مَفْعُول'

export function derivedQuestion(x: DerivedVerb, o: DerivedVerb, mode: 'faail' | 'mafool' | 'type' | 'wazn', isF: boolean): Question {
  if (mode === 'faail') {
    return choiceQ(
      `derived-faail-${x.verb}`,
      `ما **اسم الفاعل** من الفعل «${x.verb}»؟`,
      [x.faail, `أحسنتِ! اسم الفاعل بيجي على وزن فَاعِل: ${x.verb} ← ${x.faail}.`],
      [
        [x.mafool, `«${x.mafool}» اسم مفعول (وزنه مَفْعُول) بيدل على اللي وقع عليه الفعل، مش اللي قام فيه.`],
        [o.faail, `«${o.faail}» اسم فاعل، بس من الفعل «${o.verb}» مش من «${x.verb}».`],
      ],
    )
  }
  if (mode === 'mafool') {
    return choiceQ(
      `derived-mafool-${x.verb}`,
      `ما **اسم المفعول** من الفعل «${x.verb}»؟`,
      [x.mafool, `أحسنتِ! اسم المفعول بيجي على وزن مَفْعُول: ${x.verb} ← ${x.mafool}.`],
      [
        [x.faail, `«${x.faail}» اسم فاعل (وزنه فَاعِل) بيدل على اللي قام بالفعل، مش اللي وقع عليه.`],
        [o.mafool, `«${o.mafool}» اسم مفعول، بس من الفعل «${o.verb}» مش من «${x.verb}».`],
      ],
    )
  }
  const w = isF ? x.faail : x.mafool
  if (mode === 'type') {
    return choiceQ(
      `derived-type-${w}`,
      `ما نوع المشتق **${w}**؟`,
      isF
        ? ['اسم فاعل', `أحسنتِ! «${w}» من «${x.verb}» وبيدل على اللي قام بالفعل، فهو اسم فاعل.`]
        : ['اسم مفعول', `أحسنتِ! «${w}» من «${x.verb}» وبيدل على اللي وقع عليه الفعل، فهو اسم مفعول.`],
      [
        isF
          ? ['اسم مفعول', `اسم المفعول بيدل على اللي وقع عليه الفعل وبيجي على وزن مَفْعُول. أما «${w}» فعلى وزن فَاعِل وبتدل على اللي قام بالفعل.`]
          : ['اسم فاعل', `اسم الفاعل بيدل على اللي قام بالفعل وبيجي على وزن فَاعِل. أما «${w}» فعلى وزن مَفْعُول وبتدل على اللي وقع عليه الفعل.`],
        ['فعل ماضٍ', `الفعل الماضي بيدل على حدث انتهى (مثل «${x.verb}»)، أما «${w}» فاسم مشتق منه.`],
      ],
    )
  }
  return choiceQ(
    `derived-wazn-${w}`,
    `ما وزن الكلمة **${w}** في الميزان الصرفي؟`,
    isF ? [FAAIL, `أحسنتِ! «${w}» اسم فاعل، ووزنه ${FAAIL}.`] : [MAFOOL, `أحسنتِ! «${w}» اسم مفعول، ووزنه ${MAFOOL}.`],
    [
      isF
        ? [MAFOOL, `${MAFOOL} وزن اسم المفعول، فيه ميم بالأول وواو بعد العين. أما «${w}» فوزنها ${FAAIL}.`]
        : [FAAIL, `${FAAIL} وزن اسم الفاعل، فيه ألف بعد الفاء. أما «${w}» فوزنها ${MAFOOL}.`],
      ['فَعِيل', `في «فَعِيل» ياء بعد العين، و«${w}» ما فيها هيك، فوزنها ${isF ? FAAIL : MAFOOL}.`],
    ],
  )
}

export function makeDerivedQuestion(): Question {
  const x = pick(DERIVED_BANK)
  const o = pick(DERIVED_BANK.filter((y) => y !== x))
  const mode = pick(['faail', 'mafool', 'type', 'wazn'] as const)
  return derivedQuestion(x, o, mode, pick([true, false]))
}