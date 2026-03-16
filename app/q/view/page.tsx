'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import QuestionDetailView from '@/components/QuestionDetail'

function QuestionViewInner() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  if (!id) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-zinc-400">No question ID provided.</p>
      </div>
    )
  }

  return <QuestionDetailView id={id} />
}

export default function QuestionViewPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center text-zinc-500">Loading...</div>}>
      <QuestionViewInner />
    </Suspense>
  )
}
