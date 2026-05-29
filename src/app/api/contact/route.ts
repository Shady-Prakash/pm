import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { sanitizeText } from '@/lib/sanitize'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = sanitizeText(body.name ?? '')
    const email = sanitizeText(body.email ?? '')
    const message = sanitizeText(body.message ?? '')

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'Portfolio Chat <onboarding@resend.dev>',
      to: 'shadyprakash8@gmail.com',
      replyTo: email,
      subject: `New message from ${name} via your portfolio`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
