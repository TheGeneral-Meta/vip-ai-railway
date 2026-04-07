import OpenAI from 'openai'

// Hanya inisialisasi jika API key tersedia
let openaiInstance: OpenAI | null = null

function getOpenAI() {
  if (!openaiInstance) {
    if (!process.env.OPENROUTER_API_KEY) {
      console.warn('OPENROUTER_API_KEY is not set')
      return null
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    })
  }
  return openaiInstance
}

export async function generateAIResponse(prompt: string) {
  const openai = getOpenAI()
  
  if (!openai) {
    return 'Maaf, API key tidak tersedia. Silakan coba lagi nanti.'
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Answer directly and accurately in Indonesian or English as the user asks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return completion.choices[0].message.content || 'Maaf, saya tidak bisa menjawab pertanyaan itu.'
  } catch (error) {
    console.error('AI Error:', error)
    return 'Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.'
  }
}
