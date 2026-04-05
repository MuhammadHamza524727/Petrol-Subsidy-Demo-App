'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getChatbotResponse, type ChatTurn } from '@/app/actions/chat'
import {
  MessageCircle,
  X,
  Send,
  Volume2,
  VolumeX,
  Loader2,
  Bot,
  User,
  AlertTriangle,
} from 'lucide-react'

const WELCOME_MESSAGE: ChatTurn = {
  role: 'assistant',
  content:
    'Assalam o Alaikum! 👋 Main aapka petrol subsidy assistant hoon. Koi bhi sawaal poochh sakte hain — eligibility, quota, ya QR voucher ke baare mein. ⚠️ Yeh ek demo app hai — real government service nahin.',
}

export function ChatbotPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatTurn[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [ttsSupported, setTtsSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [isPending, startTransition] = useTransition()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Feature-detect TTS on mount
  useEffect(() => {
    setTtsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150)
  }, [isOpen])

  // Stop speech when panel closes
  useEffect(() => {
    if (!isOpen && ttsSupported) window.speechSynthesis.cancel()
  }, [isOpen, ttsSupported])

  function handleSpeak(text: string) {
    if (!ttsSupported) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  function handleStopSpeak() {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  function handleSend() {
    const msg = input.trim()
    if (!msg || isPending) return

    const userTurn: ChatTurn = { role: 'user', content: msg }
    setMessages((prev) => [...prev, userTurn])
    setInput('')

    startTransition(async () => {
      const res = await getChatbotResponse(msg, messages)
      const botTurn: ChatTurn = { role: 'assistant', content: res.response }
      setMessages((prev) => [...prev, botTurn])
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed bottom-6 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all active:scale-95"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          style={{ height: '420px' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-blue-700 text-white shrink-0">
            <Bot className="h-5 w-5 text-blue-200" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Subsidy Assistant</p>
              <p className="text-xs text-blue-300">AI-powered · Demo only</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-blue-600 rounded-md">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${msg.role === 'user' ? 'bg-blue-500' : 'bg-slate-500'}`}>
                  {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[78%] space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                    {msg.content}
                  </div>

                  {/* TTS button on bot messages */}
                  {msg.role === 'assistant' && ttsSupported && (
                    <button
                      onClick={() => speaking ? handleStopSpeak() : handleSpeak(msg.content)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors px-1"
                    >
                      {speaking ? (
                        <><VolumeX className="h-3 w-3" /> Stop</>
                      ) : (
                        <><Volume2 className="h-3 w-3" /> Listen</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isPending && (
              <div className="flex gap-2 items-end">
                <div className="w-7 h-7 rounded-full bg-slate-500 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="shrink-0 border-t border-slate-200 p-3 bg-white flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Koi sawaal poochhein..."
              disabled={isPending}
              className="flex-1 text-sm h-10"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isPending}
              size="icon"
              className="h-10 w-10 shrink-0"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
