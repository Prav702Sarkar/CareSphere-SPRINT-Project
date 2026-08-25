'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Brain, Send, Shield, AlertTriangle, RefreshCw, X, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage, UserRole } from '@/types'

interface ChatInterfaceProps {
  userType: UserRole
  initialGreeting?: string
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="chat-bubble-assistant flex items-center gap-1 py-3 px-4">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

function renderFormattedInline(text: string) {
  // Regex to split on **bold** and *italic*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={i} className="text-gray-600 italic">
          {part.slice(1, -1)}
        </em>
      )
    }
    return part
  })
}

function FormattedMessage({ content, isWoman }: { content: string; isWoman: boolean }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-0.5" />

        // Strip horizontal rules (--- or ***) and replace with clean divider
        if (/^[-*_]{3,}$/.test(trimmed)) {
          return <hr key={idx} className="my-2 border-gray-100" />
        }

        // Format headings by stripping #, ##, ### symbols
        if (/^#{1,6}\s+/.test(trimmed)) {
          const headingText = trimmed.replace(/^#{1,6}\s+/, '')
          return (
            <h4 key={idx} className="font-bold text-gray-900 text-sm mt-3 mb-1 flex items-center gap-1.5">
              {renderFormattedInline(headingText)}
            </h4>
          )
        }

        // Format bullet lists by stripping leading - or *
        if (/^[-*]\s+/.test(trimmed)) {
          const bulletText = trimmed.replace(/^[-*]\s+/, '')
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-1 text-gray-800">
              <span className={cn(
                'w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2',
                isWoman ? 'bg-woman-500' : 'bg-man-500'
              )} />
              <span className="flex-1">{renderFormattedInline(bulletText)}</span>
            </div>
          )
        }

        // Format numbered lists (1. Item)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/)
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-1 text-gray-800">
              <span className={cn(
                'font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                isWoman ? 'bg-woman-100 text-woman-700' : 'bg-man-100 text-man-700'
              )}>
                {numMatch[1]}
              </span>
              <span className="flex-1">{renderFormattedInline(numMatch[2])}</span>
            </div>
          )
        }

        return (
          <p key={idx} className="text-gray-800">
            {renderFormattedInline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

export default function ChatInterface({ userType, initialGreeting }: ChatInterfaceProps) {
  const searchParams = useSearchParams()
  const isWoman = userType === 'woman'
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'greeting',
      role: 'assistant',
      content: initialGreeting ?? (isWoman
        ? "Hello! I'm your CareSphere AI Health Education Assistant. I'm here to provide educational information about women's health, UTI awareness, cycle health, nutrition, and general wellness. How can I help you today?\n\n*Remember: I provide health education — not medical diagnoses or prescriptions. Always consult a healthcare professional for medical concerns.*"
        : "Hello! I'm your CareSphere UTI Education Assistant. I'm here to help you understand UTIs, including symptoms, prevention, and general self-care. What would you like to learn about?\n\n*Remember: I provide health education — not medical diagnoses or prescriptions.*"),
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const promptParam = searchParams?.get('prompt')
    if (promptParam && !input) {
      setInput(promptParam)
      inputRef.current?.focus()
    }
  }, [searchParams])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userType,
          conversationHistory: messages
            .filter((m) => m.id !== 'greeting')
            .map((m) => ({ role: m.role, content: m.content })),
          context: {
            cyclePhase: isWoman ? 'Follicular' : undefined,
            hydrationStatus: '60% of daily goal',
          },
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Something went wrong')

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 'greeting-new',
        role: 'assistant',
        content: isWoman
          ? "Chat cleared. I'm here whenever you have health education questions!"
          : "Chat cleared. Feel free to ask anything about UTI education!",
        timestamp: new Date(),
      },
    ])
    setError(null)
  }

  const SUGGESTED_QUESTIONS = isWoman ? [
    'What are common UTI symptoms?',
    'Tell me about the follicular phase',
    'What foods help with PCOS?',
    'How much water should I drink daily?',
  ] : [
    'Can men get UTIs?',
    'How can I prevent a UTI?',
    'When should I see a doctor for UTI symptoms?',
    'What are common UTI myths?',
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className={cn(
          'w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm',
          isWoman ? 'bg-gradient-to-br from-woman-500 to-rose-500' : 'bg-gradient-to-br from-man-500 to-teal-500'
        )}>
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-gray-900">AI Health Education Assistant</h3>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Online · Education mode only
          </div>
        </div>
        <button
          type="button"
          onClick={clearChat}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear chat"
          title="Clear conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div className={cn(
              'max-w-[88%]',
              msg.role === 'user'
                ? (isWoman ? 'chat-bubble-user' : 'chat-bubble-user-man')
                : 'chat-bubble-assistant'
            )}>
              {msg.role === 'user' ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <FormattedMessage content={msg.content} isWoman={isWoman} />
              )}
              <div className={cn(
                'text-[10px] mt-1.5 font-medium',
                msg.role === 'user' ? 'text-white/70 text-right' : 'text-gray-400'
              )}>
                {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {loading && <TypingIndicator />}

        {error && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5" />
              {error}
              <button type="button" onClick={() => setError(null)}>
                <X className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions (only when no user messages) */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-400 font-medium mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => { setInput(q); inputRef.current?.focus() }}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-xl border transition-all',
                  isWoman
                    ? 'bg-woman-50 border-woman-200 text-woman-700 hover:bg-woman-100'
                    : 'bg-man-50 border-man-200 text-man-700 hover:bg-man-100'
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-4 pb-2">
        <div className="flex items-start gap-1.5 text-[10px] text-gray-400">
          <Shield className="w-3 h-3 flex-shrink-0 mt-0.5 text-amber-500" />
          AI provides health education only — not medical diagnoses or prescriptions. Always consult a healthcare professional.
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              className="input resize-none min-h-[44px] max-h-32 pr-4 py-3 leading-relaxed"
              placeholder="Ask a health education question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              aria-label="Chat message input"
            />
          </div>
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className={cn(
              'btn w-11 h-11 p-0 flex-shrink-0 rounded-2xl',
              isWoman ? 'btn-primary-woman' : 'btn-primary-man',
              'disabled:opacity-50'
            )}
            aria-label="Send message"
            id="send-chat-btn"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
