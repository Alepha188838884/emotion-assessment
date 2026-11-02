const DASHSCOPE_API_KEY =
  import.meta.env.VITE_DASHSCOPE_API_KEY || ''

const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

export async function callQwenChat(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  if (!DASHSCOPE_API_KEY || DASHSCOPE_API_KEY === '<PASTE_KEY_HERE>') {
    throw new Error(
      '未配置 DashScope API Key。请在 .env.local 中设置 VITE_DASHSCOPE_API_KEY。',
    )
  }

  const response = await fetch(`${DASHSCOPE_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen3.5-plus',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DashScope 请求失败 (${response.status})：${errorText}`)
  }

  const data = (await response.json()) as ChatCompletionResponse
  const content = data.choices?.[0]?.message?.content

  if (!content || !content.trim()) {
    throw new Error('Qwen 返回内容为空，请稍后重试。')
  }

  return content.trim()
}
