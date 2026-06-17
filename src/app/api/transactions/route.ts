import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')

  let query = supabase
    .from('transactions')
    .select('*, layers(*), categories(*)')
    .order('date', { ascending: false })

  if (month) {
    query = query.gte('date', `${month}-01`).lte('date', `${month}-31`)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { data, error } = await supabase
    .from('transactions')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
