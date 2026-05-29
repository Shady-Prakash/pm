'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import SectionPagination from './SectionPagination'

interface Props {
  page: number
  totalPages: number
  total: number
  pageSize: number
}

export default function BlogPagination({ page, totalPages, total, pageSize }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const go = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  return (
    <div className={`transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
      <SectionPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onChange={go}
      />
    </div>
  )
}
