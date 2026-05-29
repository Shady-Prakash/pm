'use client'

import { useState, useRef, useEffect } from 'react'

type Step = 'name' | 'email' | 'message' | 'sending' | 'done' | 'error'

interface Message {
  from: 'bot' | 'user'
  text: string
}

const BOT_PROMPTS: Record<string, string> = {
  name: "Hi there! 👋 I'm Prakash's assistant. What's your name?",
  email: "Nice to meet you, {name}! What's your email so Prakash can reply?",
  message: 'Got it! What would you like to say to Prakash?',
  sending: 'Sending your message...',
  done: "Your message has been sent! Prakash will get back to you soon. ✅",
  error: "Hmm, something went wrong. Please try emailing directly at shadyprakash8@gmail.com",
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('name')
  const [input, setInput] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: 'bot', text: BOT_PROMPTS.name }])
    }
  }, [open, messages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open, step])

  function addMessage(from: 'bot' | 'user', text: string) {
    setMessages((prev) => [...prev, { from, text }])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = input.trim()
    if (!value || step === 'sending' || step === 'done') return
    setInput('')

    if (step === 'name') {
      addMessage('user', value)
      setName(value)
      setTimeout(() => {
        addMessage('bot', BOT_PROMPTS.email.replace('{name}', value))
        setStep('email')
      }, 400)
    } else if (step === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        addMessage('bot', "That doesn't look like a valid email. Please try again.")
        return
      }
      addMessage('user', value)
      setEmail(value)
      setTimeout(() => {
        addMessage('bot', BOT_PROMPTS.message)
        setStep('message')
      }, 400)
    } else if (step === 'message') {
      addMessage('user', value)
      setStep('sending')
      addMessage('bot', BOT_PROMPTS.sending)

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message: value }),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          addMessage('bot', BOT_PROMPTS.done)
          setStep('done')
        } else {
          addMessage('bot', BOT_PROMPTS.error)
          setStep('error')
        }
      } catch {
        addMessage('bot', BOT_PROMPTS.error)
        setStep('error')
      }
    }
  }

  function reset() {
    setStep('name')
    setName('')
    setEmail('')
    setInput('')
    setMessages([{ from: 'bot', text: BOT_PROMPTS.name }])
  }

  const placeholder =
    step === 'name' ? 'Your name...' :
    step === 'email' ? 'your@email.com' :
    step === 'message' ? 'Write your message...' : ''

  return (
    <>
      {/* Chat bubble button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-400 text-zinc-950 rounded-full shadow-lg hover:bg-green-300 transition-colors flex items-center justify-center"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <div>
              <p className="text-zinc-100 text-sm font-semibold">Chat with Prakash</p>
              <p className="text-zinc-500 text-xs">Usually replies within a day</p>
            </div>
            {(step === 'done' || step === 'error') && (
              <button
                onClick={reset}
                className="ml-auto text-zinc-500 hover:text-green-400 text-xs font-mono transition-colors"
              >
                Restart
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-72">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-green-400 text-zinc-950 rounded-br-sm'
                      : 'bg-zinc-800 text-zinc-200 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {step !== 'done' && step !== 'sending' && step !== 'error' && (
            <form onSubmit={handleSubmit} className="flex gap-2 px-4 py-3 border-t border-zinc-800">
              <input
                ref={inputRef}
                type={step === 'email' ? 'email' : 'text'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm px-4 py-2 rounded-full outline-none focus:ring-1 focus:ring-green-400 transition"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 bg-green-400 text-zinc-950 rounded-full flex items-center justify-center hover:bg-green-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Send"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          )}
        </div>
      )}
    </>
  )
}
