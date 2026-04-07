export interface User {
  id: string
  email: string
  name: string | null
  quota: number
  plan: 'free' | 'premium' | 'enterprise'
  created_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatHistory {
  id: string
  user_id: string
  messages: ChatMessage[]
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  plan: string
  status: 'pending' | 'success' | 'failed'
  transaction_id: string
  created_at: string
}
