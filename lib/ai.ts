import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

export async function generateAIResponse(prompt: string) {
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
}
