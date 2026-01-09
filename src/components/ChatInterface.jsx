import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:8000/rag/query',
        { question: userMessage, top_k: 3 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const fullAnswer = response.data.answer || 'No answer received'
      const words = fullAnswer.split(' ')

      // Add an empty assistant message that we'll fill word by word
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      let i = 0
      const streamWord = () => {
        setMessages((prev) => {
          if (prev.length === 0) return prev
          const updated = [...prev]
          const lastIndex = updated.length - 1
          const currentContent = updated[lastIndex].content || ''
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: currentContent + (currentContent ? ' ' : '') + words[i],
          }
          return updated
        })

        i += 1
        if (i < words.length) {
          setTimeout(streamWord, 30) // speed (ms) between words
        }
      }

      streamWord()
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            error.response?.data?.detail ||
            'Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ask Your Documents</h2>
        <p className="text-gray-600">Query your uploaded documents using AI</p>
        <p className="text-gray-600 mt-0 pt-0 font-bold text-[12px]">Developed By @shispare</p>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-6 mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm mt-2">Ask questions about your uploaded documents</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your documents..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  )
}
