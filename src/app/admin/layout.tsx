import { headers } from 'next/headers'
import AdminShell from './_components/AdminShell'

export const metadata = { title: 'Admin — Prakash Mahat' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const email = h.get('x-user-email')

  // No session header means login page (proxy handles redirect for all other routes)
  if (!email) {
    return <>{children}</>
  }

  const user = {
    name: h.get('x-user-name') ?? undefined,
    email,
    image: h.get('x-user-image') ?? undefined,
  }

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  )
}
