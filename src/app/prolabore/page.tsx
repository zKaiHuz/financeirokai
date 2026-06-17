import { supabase } from '@/lib/supabase'
import ProlaboreClient from './ProlaboreClient'
import { Prolabore } from '@/types'

async function getData() {
  const { data } = await supabase
    .from('prolabore')
    .select('*')
    .order('month', { ascending: false })
  return (data || []) as Prolabore[]
}

export default async function ProlalorePage() {
  const records = await getData()
  return <ProlaboreClient initialRecords={records} />
}
