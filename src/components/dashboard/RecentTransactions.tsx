import { Transaction } from '@/types'

const fmt = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-4">Últimos Lançamentos</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">Nenhum lançamento ainda</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{t.categories?.icon || '📌'}</span>
                <div>
                  <div className="text-sm text-white">
                    {t.description || t.categories?.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span
                      className={
                        t.layers?.type === 'PF' ? 'text-blue-400' : 'text-emerald-400'
                      }
                    >
                      {t.layers?.name}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                    {t.source === 'whatsapp' && (
                      <span className="text-green-500">WhatsApp</span>
                    )}
                  </div>
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  t.type === 'receita' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {t.type === 'receita' ? '+' : '-'}
                {fmt(t.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
