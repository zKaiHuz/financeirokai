import TransactionForm from '@/components/transactions/TransactionForm'
import { supabase } from '@/lib/supabase'

async function getFormData() {
  const [{ data: layers }, { data: categories }] = await Promise.all([
    supabase.from('layers').select('*'),
    supabase.from('categories').select('*').order('name'),
  ])
  return { layers: layers || [], categories: categories || [] }
}

export default async function LancamentosPage() {
  const { layers, categories } = await getFormData()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Novo Lançamento</h1>
        <p className="text-gray-400 text-sm mt-1">Registre receitas e despesas rapidamente</p>
      </div>

      <div className="bg-gray-900 border border-green-500/20 rounded-xl p-4">
        <div className="text-xs text-green-400 font-medium mb-2">💬 Atalhos via WhatsApp</div>
        <div className="space-y-1 text-xs text-gray-400">
          <div>
            <code className="text-yellow-400">desp 150 alimentação almoço</code> → despesa PF
          </div>
          <div>
            <code className="text-yellow-400">pj rec 2000 venda cliente x</code> → receita PJ
          </div>
          <div>
            <code className="text-yellow-400">prolabore 4500 2026-06</code> → pro-labore
          </div>
        </div>
      </div>

      <TransactionForm layers={layers} categories={categories} />
    </div>
  )
}
