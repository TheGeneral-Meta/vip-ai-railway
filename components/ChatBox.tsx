'use client'

import { useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo! Ada yang bisa saya bantu? 🚀' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      const data = await res.json()

      if (data.error) {
        if (data.needsUpgrade) {
          setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Quota habis! Silakan upgrade ke premium di halaman Pricing.' }])
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error: ' + data.error }])
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Terjadi kesalahan. Silakan coba lagi.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <h2 className="text-white font-bold text-xl">VIP AI Chat</h2>
        <p className="text-white/80 text-sm">Powered by DeepSeek</p>
      </div>

      <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white shadow-md text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md p-3 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2
