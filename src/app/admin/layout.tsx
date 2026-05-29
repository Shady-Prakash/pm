import { cache } from 'react'
import { auth } from '@/auth'
import AdminShell from './_components/AdminShell'

export const metadata = { title: 'Admin — Prakash Mahat' }

const getSession = cache(auth)

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    return <>{children}</>
  }

  return (
    <AdminShell user={session.user}>
      {children}
    </AdminShell>
  )
}
