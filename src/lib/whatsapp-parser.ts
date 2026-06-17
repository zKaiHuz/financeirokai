export interface ParsedTransaction {
  layer?: 'PF' | 'PJ'
  type: 'receita' | 'despesa'
  amount: number
  category: string
  description: string
}

export function parseWhatsAppMessage(text: string): ParsedTransaction | null {
  const lower = text.toLowerCase().trim()
  let remaining = lower
  let layer: 'PF' | 'PJ' | undefined

  if (remaining.startsWith('pf ')) {
    layer = 'PF'
    remaining = remaining.slice(3)
  } else if (remaining.startsWith('pj ')) {
    layer = 'PJ'
    remaining = remaining.slice(3)
  }

  const typeMatch = remaining.match(/^(receita|despesa|rec|desp)\s+/)
  if (!typeMatch) return null

  const type = typeMatch[1].startsWith('rec') ? 'receita' : 'despesa'
  remaining = remaining.slice(typeMatch[0].length)

  const amountMatch = remaining.match(/^(\d+(?:[.,]\d{1,2})?)\s+/)
  if (!amountMatch) return null

  const amount = parseFloat(amountMatch[1].replace(',', '.'))
  remaining = remaining.slice(amountMatch[0].length)

  const words = remaining.trim().split(' ')
  const category = words[0] || 'outros'
  const description = words.slice(1).join(' ')

  return { layer, type, amount, category, description }
}
