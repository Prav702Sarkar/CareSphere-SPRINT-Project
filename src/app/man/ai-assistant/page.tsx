import { Suspense } from 'react'
import ChatInterface from '@/components/chatbot/ChatInterface'

export default function ManAIAssistantPage() {
  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="mb-4 flex-shrink-0">
        <h2 className="section-title">AI UTI Education Assistant</h2>
        <p className="section-subtitle">Educational guidance about UTI health — not medical diagnosis</p>
      </div>
      <div className="flex-1 card overflow-hidden flex flex-col min-h-0">
        <Suspense fallback={<div className="p-8 text-center text-gray-400 text-sm">Loading assistant...</div>}>
          <ChatInterface userType="man" />
        </Suspense>
      </div>
    </div>
  )
}
