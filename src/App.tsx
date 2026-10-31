import { useSyncExternalStore } from 'react'
import { findExam, findLesson } from './content'
import { ExamView } from './components/ExamView'
import { Home } from './components/Home'
import { LessonRunner } from './components/LessonRunner'

function subscribeHash(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}
const getHash = () => window.location.hash
const goHome = () => {
  window.location.hash = '#/'
}

export default function App() {
  const hash = useSyncExternalStore(subscribeHash, getHash)
  const lessonMatch = /^#\/lesson\/(.+)$/.exec(hash)
  const lesson = lessonMatch ? findLesson(decodeURIComponent(lessonMatch[1])) : undefined
  const examMatch = /^#\/exam\/(.+)$/.exec(hash)
  const exam = examMatch ? findExam(decodeURIComponent(examMatch[1])) : undefined

  if (lesson) return <LessonRunner key={lesson.id} lesson={lesson} onExit={goHome} />
  if (exam) return <ExamView key={exam.id} exam={exam} onExit={goHome} />
  return <Home />
}