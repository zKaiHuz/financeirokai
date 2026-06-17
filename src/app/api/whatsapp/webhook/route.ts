import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { parseWhatsAppMessage } from '@/lib/whatsapp-parser'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Evolution API webhook — message text extraction
  const message: string =
    body?.data?.message?.conversation ||
    body?.data?.message?.extendedTextMessage?.text ||
    ''

  if (!message.trim()) return NextResponse.json({ ok: true })

  const lower = message.toLowerCase().trim()

  // Special command: prolabore <amount> <month>
  if (lower.startsWith('prolabore ')) {
    const parts = lower.replace('prolabore ', '').trim().split(/\s+/)
    const amount = parseFloat(parts[0])
    const month = parts[1] || new Date().toISOString().slice(0, 7)

    if (amount > 0) {
      await supabase.from('prolabore').insert({ amount, month })
      return NextResponse.json({ ok: true, action: 'prolabore_created', amount, month })
    }
  }

  const parsed = parseWhatsAppMessage(message)
  if (!parsed) return NextResponse.json({ ok: true, action: 'not_parsed' })

  const [{ data: layers }, { data: categories }] = await Promise.all([
    supabase.from('layers').select('*'),
    supabase.from('categories').select('*'),
  ])

  const layer = (layers || []).find((l) =>
    parsed.layer ? l.type === parsed.layer : l.type === 'PF'
  )

  const category =
    (categories || []).find((c) =>
      c.name.toLowerCase().includes(parsed.category.toLowerCase())
    ) || (categories || []).find((c) => c.name === 'Outros')

  const { error } = await supabase.from('transactions').insert({
    layer_id: layer?.id,
    category_id: category?.id,
    type: parsed.type,
    amount: parsed.amount,
    description: parsed.description || parsed.category,
    date: new Date().toISOString().split('T')[0],
    source: 'whatsapp',
    whatsapp_raw: message,
  })

  if (error) return NextResponse.json({ ok: false, error }, { status: 500 })
  return NextResponse.json({ ok: true, action: 'transaction_created', parsed })
}

export async function GET() {
  return NextResponse.json({ status: 'webhook active', service: 'FinanceiroKai' })
}
