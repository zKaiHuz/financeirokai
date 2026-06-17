'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Prolabore } from '@/types'

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ProlaboreClient({ initialRecords }: { initialRecords: Prolabore[] }) {
  const [records, setRecords] = useState(initialRecords)
  const [form, setForm] = useState({
    amount: '',
    month: new Date().toISOString().slice(0, 7),
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data } = await supabase
      .from('prolabore')
      .insert({ ...form, amount: parseFloat(form.amount) })
      .select()
      .single()
    if (data) setRecords((prev) => [data as Prolabore, ...prev])
    setForm((prev) => ({ ...prev, amount: '', notes: '' }))
    setSuccess(true)
    setLoading(false)
    setTimeout(() => setSuccess(false), 2000)
  }

  const markAsPaid = async (id: string) => {
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('prolabore').update({ status: 'pago', paid_at: today }).eq('id', id)
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'pago' as const, paid_at: today } : r))
    )
  }

  const totalPaid = records.filter((r) => r.status === 'pago').reduce((a, r) => a + r.amount, 0)
  const totalPending = records
    .filter((r) => r.status === 'pendente')
    .reduce((a, r) => a + r.amount, 0)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pro-labore</h1>
        <p className="text-gray-400 text-sm mt-1">Remuneração da Luvisi&apos;s para Kaique</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-xs text-gray-400">Total Pago (histórico)</div>
          <div className="text-xl font-bold text-emerald-400">{fmt(totalPaid)}</div>
        </div>
        <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-4">
          <div className="text-xs text-gray-400">Pendente</div>
          <div className="text-xl font-bold text-yellow-400">{fmt(totalPending)}</div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4"
      >
        <h3 className="font-semibold text-white">Novo Pro-labore</h3>
        {success && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-2 text-emerald-400 text-sm text-center">
            ✓ Registrado!
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Valor</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              placeholder="0,00"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Mês</label>
            <input
              type="month"
              required
              value={form.month}
              onChange={(e) => setForm((p) => ({ ...p, month: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Observações</label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Opcional"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !form.amount}
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors"
        >
          {loading ? 'Salvando...' : 'Registrar Pro-labore'}
        </button>
      </form>

      <div className="space-y-2">
        {records.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">Nenhum pro-labore registrado</p>
        )}
        {records.map((r) => (
          <div
            key={r.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <div className="text-white font-semibold">{fmt(r.amount)}</div>
              <div className="text-xs text-gray-400">
                {r.month}
                {r.notes && ` • ${r.notes}`}
              </div>
            </div>
            {r.status === 'pendente' ? (
              <button
                onClick={() => markAsPaid(r.id)}
                className="text-xs px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full hover:bg-yellow-500/30 transition-colors"
              >
                Marcar como Pago
              </button>
            ) : (
              <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                ✓ Pago{r.paid_at && ` em ${new Date(r.paid_at + 'T00:00:00').toLocaleDateString('pt-BR')}`}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
