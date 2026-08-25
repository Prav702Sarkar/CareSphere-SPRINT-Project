import { Suspense } from 'react'
import { Metadata } from 'next'
import ChatInterface from '@/components/chatbot/ChatInterface'

export const metadata: Metadata = {
  title: 'AI Health Assistant',
  description: 'CareSphere AI Health Education Assistant — educational guidance for women\'s health, cycle tracking, UTI awareness, and wellness.',
}

export default function AIAssistantPage() {
  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="mb-4 flex-shrink-0">
        <h2 className="section-title">AI Health Assistant</h2>
        <p className="section-subtitle">Educational guidance — not medical diagnosis</p>
      </div>
      <div className="flex-1 card overflow-hidden flex flex-col min-h-0">
        <Suspense fallback={<div className="p-8 text-center text-gray-400 text-sm">Loading assistant...</div>}>
          <ChatInterface userType="woman" />
        </Suspense>
      </div>
    </div>
  )
}
