import { supabase } from '@/lib/supabase'
import { Transaction } from '@/types'
import CategoryPieChart from '@/components/charts/CategoryPieChart'
import MonthlyBarChart from '@/components/charts/MonthlyBarChart'

async function getData() {
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const firstDay = sixMonthsAgo.toISOString().split('T')[0]

  const [{ data: transactions }, { data: layers }] = await Promise.all([
    supabase
      .from('transactions')
      .select('*, layers(*), categories(*)')
      .gte('date', firstDay)
      .order('date', { ascending: false }),
    supabase.from('layers').select('*'),
  ])

  return {
    transactions: (transactions || []) as Transaction[],
    layers: layers || [],
  }
}

function buildCategoryData(transactions: Transaction[], layerType?: string) {
  const filtered = layerType
    ? transactions.filter((t) => t.layers?.type === layerType && t.type === 'despesa')
    : transactions.filter((t) => t.type === 'despesa')

  const map: Record<string, { name: string; value: number; color: string; icon: string }> = {}

  for (const t of filtered) {
    const key = t.categories?.name || 'Outros'
    if (!map[key]) {
      map[key] = {
        name: key,
        value: 0,
        color: t.categories?.color || '#94a3b8',
        icon: t.categories?.icon || '📌',
      }
    }
    map[key].value += t.amount
  }

  return Object.values(map).sort((a, b) => b.value - a.value)
}

function buildMonthlyData(transactions: Transaction[], layerType?: string) {
  const filtered = layerType
    ? transactions.filter((t) => t.layers?.type === layerType)
    : transactions

  const map: Record<string, { receitas: number; despesas: number }> = {}

  for (const t of filtered) {
    const month = t.date.slice(0, 7)
    if (!map[month]) map[month] = { receitas: 0, despesas: 0 }
    if (t.type === 'receita') map[month].receitas += t.amount
    if (t.type === 'despesa') map[month].despesas += t.amount
  }

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: new Date(month + '-02').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      ...data,
    }))
}

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default async function CategoriasPage() {
  const { transactions } = await getData()

  const thisMonth = new Date().toISOString().slice(0, 7)
  const thisMonthTxs = transactions.filter((t) => t.date.startsWith(thisMonth))

  const pfCategories = buildCategoryData(transactions, 'PF')
  const pjCategories = buildCategoryData(transactions, 'PJ')
  const pfMonthly = buildMonthlyData(transactions, 'PF')
  const pjMonthly = buildMonthlyData(transactions, 'PJ')

  const pfTotalMonth = thisMonthTxs
    .filter((t) => t.layers?.type === 'PF' && t.type === 'despesa')
    .reduce((a, t) => a + t.amount, 0)

  const pjTotalMonth = thisMonthTxs
    .filter((t) => t.layers?.type === 'PJ' && t.type === 'despesa')
    .reduce((a, t) => a + t.amount, 0)

  const topPF = pfCategories[0]
  const topPJ = pjCategories[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Categorias</h1>
        <p className="text-gray-400 text-sm mt-1">Análise de gastos por categoria</p>
      </div>

      {/* Resumo do mês */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-blue-500/30 rounded-xl p-4">
          <div className="text-xs text-blue-400 mb-1">Kaique — gasto no mês</div>
          <div className="text-xl font-bold text-white">{fmt(pfTotalMonth)}</div>
          {topPF && <div className="text-xs text-gray-500 mt-1">Top: {topPF.icon} {topPF.name}</div>}
        </div>
        <div className="bg-gray-900 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-xs text-emerald-400 mb-1">Luvisi&apos;s — gasto no mês</div>
          <div className="text-xl font-bold text-white">{fmt(pjTotalMonth)}</div>
          {topPJ && <div className="text-xs text-gray-500 mt-1">Top: {topPJ.icon} {topPJ.name}</div>}
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 col-span-2">
          <div className="text-xs text-gray-400 mb-1">Total gasto no mês</div>
          <div className="text-xl font-bold text-white">{fmt(pfTotalMonth + pjTotalMonth)}</div>
          <div className="text-xs text-gray-500 mt-1">
            {thisMonthTxs.filter((t) => t.type === 'despesa').length} lançamentos
          </div>
        </div>
      </div>

      {/* Gráficos de pizza */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryPieChart data={pfCategories} title="🔵 Kaique (PF) — Gastos por categoria" />
        <CategoryPieChart data={pjCategories} title="🟢 Luvisi's (PJ) — Gastos por categoria" />
      </div>

      {/* Gráficos mensais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyBarChart data={pfMonthly} />
        <MonthlyBarChart data={pjMonthly} />
      </div>

      {/* Tabela detalhada */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryTable title="🔵 Kaique — Detalhamento" data={pfCategories} total={pfTotalMonth} />
        <CategoryTable title="🟢 Luvisi's — Detalhamento" data={pjCategories} total={pjTotalMonth} />
      </div>
    </div>
  )
}

function CategoryTable({
  title,
  data,
  total,
}: {
  title: string
  data: { name: string; value: number; color: string; icon: string }[]
  total: number
}) {
  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-4">{title}</h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">Nenhuma despesa</p>
      ) : (
        <div className="space-y-2">
          {data.map((item, i) => {
            const pct = total > 0 ? (item.value / total) * 100 : 0
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">
                    {item.icon} {item.name}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-white">{fmt(item.value)}</span>
                    <span className="text-xs text-gray-500 ml-2">{pct.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: item.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
