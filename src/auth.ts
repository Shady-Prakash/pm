import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      return user.email === process.env.ADMIN_EMAIL
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
})
