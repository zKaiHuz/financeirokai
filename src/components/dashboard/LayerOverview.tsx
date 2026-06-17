interface Props {
  layer: 'PF' | 'PJ'
  name: string
  balance: number
  receitas: number
  despesas: number
}

const fmt = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function LayerOverview({ layer, name, balance, receitas, despesas }: Props) {
  const isPositive = balance >= 0
  const borderColor = layer === 'PF' ? 'border-blue-500/30' : 'border-emerald-500/30'
  const badgeColor =
    layer === 'PF'
      ? 'bg-blue-500/20 text-blue-400'
      : 'bg-emerald-500/20 text-emerald-400'
  const balanceColor = isPositive ? 'text-emerald-400' : 'text-red-400'

  return (
    <div className={`bg-gray-900 border ${borderColor} rounded-xl p-5 space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${badgeColor}`}>
            {layer}
          </span>
          <h2 className="text-lg font-bold text-white mt-1">{name}</h2>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Saldo do mês</div>
          <div className={`text-xl font-bold ${balanceColor}`}>{fmt(balance)}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-500/10 rounded-lg p-3">
          <div className="text-xs text-gray-400">Receitas</div>
          <div className="text-sm font-semibold text-emerald-400">{fmt(receitas)}</div>
        </div>
        <div className="bg-red-500/10 rounded-lg p-3">
          <div className="text-xs text-gray-400">Despesas</div>
          <div className="text-sm font-semibold text-red-400">{fmt(despesas)}</div>
        </div>
      </div>
    </div>
  )
}
