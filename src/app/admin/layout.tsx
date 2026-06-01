import { auth } from '@/auth'
import AdminShell from './_components/AdminShell'

export const metadata = { title: 'Admin — Prakash Mahat' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Login page renders without the shell
  if (!session) {
    return <>{children}</>
  }

  return (
    <AdminShell user={session.user}>
      {children}
    </AdminShell>
  )
}
