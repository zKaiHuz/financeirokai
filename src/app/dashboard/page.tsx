import { supabase } from '@/lib/supabase'
import LayerOverview from '@/components/dashboard/LayerOverview'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import { Transaction, Layer, Prolabore } from '@/types'

async function getData() {
  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const firstDay = `${thisMonth}-01`

  const [{ data: transactions }, { data: prolabore }, { data: layers }] = await Promise.all([
    supabase
      .from('transactions')
      .select('*, layers(*), categories(*)')
      .gte('date', firstDay)
      .order('date', { ascending: false }),
    supabase.from('prolabore').select('*').eq('month', thisMonth).maybeSingle(),
    supabase.from('layers').select('*'),
  ])

  return {
    transactions: (transactions || []) as Transaction[],
    prolabore: prolabore as Prolabore | null,
    layers: (layers || []) as Layer[],
  }
}

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default async function DashboardPage() {
  const { transactions, prolabore, layers } = await getData()

  const pfLayer = layers.find((l) => l.type === 'PF')
  const pjLayer = layers.find((l) => l.type === 'PJ')
  const pfTxs = transactions.filter((t) => t.layer_id === pfLayer?.id)
  const pjTxs = transactions.filter((t) => t.layer_id === pjLayer?.id)

  const calcBalance = (txs: Transaction[]) =>
    txs.reduce((acc, t) => (t.type === 'receita' ? acc + t.amount : acc - t.amount), 0)

  const sum = (txs: Transaction[], type: string) =>
    txs.filter((t) => t.type === type).reduce((a, t) => a + t.amount, 0)

  const now = new Date()
  const monthLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1 capitalize">{monthLabel}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pfLayer && (
          <LayerOverview
            layer="PF"
            name={pfLayer.name}
            balance={calcBalance(pfTxs)}
            receitas={sum(pfTxs, 'receita')}
            despesas={sum(pfTxs, 'despesa')}
          />
        )}
        {pjLayer && (
          <LayerOverview
            layer="PJ"
            name={pjLayer.name}
            balance={calcBalance(pjTxs)}
            receitas={sum(pjTxs, 'receita')}
            despesas={sum(pjTxs, 'despesa')}
          />
        )}
      </div>

      {prolabore && (
        <div className="bg-gray-900 border border-teal-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-teal-400 font-medium uppercase tracking-wider">
              Pro-labore do Mês
            </span>
            <div className="text-2xl font-bold text-white mt-1">
              {fmt(prolabore.amount)}
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              prolabore.status === 'pago'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}
          >
            {prolabore.status === 'pago' ? '✓ Pago' : '⏳ Pendente'}
          </span>
        </div>
      )}

      <RecentTransactions transactions={transactions.slice(0, 10)} />
    </div>
  )
}
