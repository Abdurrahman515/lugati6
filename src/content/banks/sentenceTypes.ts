import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import { pick } from '../../lib/random'

export type SentenceKind = 'nominal' | 'verbal'
export const SENTENCE_KINDS: SentenceKind[] = ['nominal', 'verbal']
export const SENTENCE_LABEL: Record<SentenceKind, string> = {
  nominal: 'الجملة الاسمية',
  verbal: 'الجملة الفعلية',
}

export interface BankSentence {
  id: string
  s: string
  kind: SentenceKind
  detail: string
}

const nominal = (id: string, start: string, predicate: string): BankSentence => ({
  id,
  s: `${start} ${predicate}`,
  kind: 'nominal',
  detail: `تبدأ باسم هو «${start}» (المبتدأ)، وخبره «${predicate}»، وكلاهما مرفوع`,
})

const verbal = (id: string, verb: string, subject: string, tail = '', object = ''): BankSentence => ({
  id,
  s: `${verb} ${subject}${tail ? ' ' + tail : ''}`,
  kind: 'verbal',
  detail: `تبدأ بفعل هو «${verb}»، وفاعله «${subject}»${object ? `، والمفعول به «${object}»` : ''}`,
})

export const SENTENCE_BANK: BankSentence[] = [
  nominal('n1', 'الحَدِيقَةُ', 'وَاسِعَةٌ'),
  nominal('n2', 'السَّمَاءُ', 'صَافِيَةٌ'),
  nominal('n3', 'المُعَلِّمُ', 'نَشِيطٌ'),
  nominal('n4', 'البَابُ', 'مَفْتُوحٌ'),
  nominal('n5', 'الشَّمْسُ', 'سَاطِعَةٌ'),
  nominal('n6', 'الطَّالِبَةُ', 'مُجْتَهِدَةٌ'),
  nominal('n7', 'الجَوُّ', 'مُعْتَدِلٌ'),
  nominal('n8', 'القِطَّةُ', 'نَائِمَةٌ'),
  verbal('v1', 'كَتَبَ', 'الطَّالِبُ', 'الدَّرْسَ', 'الدَّرْسَ'),
  verbal('v2', 'شَكَرَ', 'المُؤْمِنُ', 'اللهَ', 'اللهَ'),
  verbal('v3', 'ذَهَبَتِ', 'البِنْتُ', 'إِلَى المَدْرَسَةِ'),
  verbal('v4', 'يَلْعَبُ', 'الأَطْفَالُ', 'فِي الحَدِيقَةِ'),
  verbal('v5', 'رَسَمَتِ', 'الطَّالِبَةُ', 'لَوْحَةً', 'لَوْحَةً'),
  verbal('v6', 'فَتَحَ', 'الأَبُ', 'البَابَ', 'البَابَ'),
  verbal('v7', 'تُشْرِقُ', 'الشَّمْسُ', 'صَبَاحاً'),
  verbal('v8', 'قَرَأَ', 'الوَلَدُ', 'القِصَّةَ', 'القِصَّةَ'),
  verbal('v9', 'نَجَحَ', 'المُجْتَهِدُ'),
]

export function bySentenceId(id: string): BankSentence {
  const found = SENTENCE_BANK.find((b) => b.id === id)
  if (!found) throw new Error(`الجملة غير موجودة في البنك: ${id}`)
  return found
}

export function explainSentenceWrong(target: BankSentence, picked: SentenceKind): string {
  const first = target.s.split(' ')[0]
  return picked === 'verbal'
    ? `الجملة الفعلية بتبدأ بفعل، أما هالجملة فأول كلمة فيها «${first}» وهي اسم، يعني الجملة اسمية. ${target.detail}.`
    : `الجملة الاسمية بتبدأ باسم، أما هالجملة فأول كلمة فيها «${first}» وهي فعل، يعني الجملة فعلية. ${target.detail}.`
}

export function sentenceSortItems(ids: string[]): SortItem[] {
  return ids.map((id) => {
    const b = bySentenceId(id)
    const whyNot: Record<string, string> = {}
    for (const k of SENTENCE_KINDS) {
      if (k !== b.kind) whyNot[k] = explainSentenceWrong(b, k)
    }
    return { text: b.s, bucket: b.kind, why: `${SENTENCE_LABEL[b.kind]}: ${b.detail}.`, whyNot }
  })
}

export function makeSentenceTypeQuestion(): Question {
  const target = pick(SENTENCE_BANK)
  return {
    kind: 'choice',
    id: 'sentence-type',
    prompt: `ما نوع هذه الجملة؟\n**${target.s}**`,
    choices: SENTENCE_KINDS.map((k) =>
      k === target.kind
        ? { text: SENTENCE_LABEL[k], correct: true, why: `أحسنتِ! ${SENTENCE_LABEL[k]}: ${target.detail}.` }
        : { text: SENTENCE_LABEL[k], why: explainSentenceWrong(target, k) },
    ),
  }
}