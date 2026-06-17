'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Category, Layer } from '@/types'
import { useRouter } from 'next/navigation'

interface Props {
  layers: Layer[]
  categories: Category[]
}

export default function TransactionForm({ layers, categories }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    layer_id: layers[0]?.id || '',
    type: 'despesa' as 'receita' | 'despesa' | 'transferencia',
    amount: '',
    category_id: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })

  const selectedLayer = layers.find((l) => l.id === form.layer_id)
  const filteredCategories = categories.filter(
    (c) => c.layer_type === 'BOTH' || c.layer_type === selectedLayer?.type
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await supabase.from('transactions').insert({
      ...form,
      amount: parseFloat(form.amount),
      source: 'web',
    })
    setSuccess(true)
    setLoading(false)
    setForm((prev) => ({ ...prev, amount: '', description: '', category_id: '' }))
    setTimeout(() => {
      setSuccess(false)
      router.refresh()
    }, 2000)
  }

  const typeConfig = {
    receita: { label: '↑ Receita', color: 'emerald' },
    despesa: { label: '↓ Despesa', color: 'red' },
    transferencia: { label: '⇄ Transferência', color: 'yellow' },
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
      {success && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 text-emerald-400 text-sm text-center">
          ✓ Lançamento registrado com sucesso!
        </div>
      )}

      {/* Layer */}
      <div>
        <label className="text-xs text-gray-400 mb-2 block">Conta</label>
        <div className="grid grid-cols-2 gap-3">
          {layers.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, layer_id: layer.id, category_id: '' }))}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                form.layer_id === layer.id
                  ? layer.type === 'PF'
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {layer.name}{' '}
              <span className="text-xs opacity-70">({layer.type})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="text-xs text-gray-400 mb-2 block">Tipo</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(typeConfig) as [typeof form.type, { label: string; color: string }][]).map(
            ([type, { label, color }]) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type }))}
                className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                  form.type === type
                    ? `border-${color}-500 bg-${color}-500/20 text-${color}-400`
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Valor (R$)</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          required
          value={form.amount}
          onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
          placeholder="0,00"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-xs text-gray-400 mb-2 block">Categoria</label>
        <div className="flex flex-wrap gap-2">
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, category_id: cat.id }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                form.category_id === cat.id
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Descrição</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Ex: Almoço no restaurante"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Date */}
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Data</label>
        <input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !form.amount || !form.category_id}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
      >
        {loading ? 'Salvando...' : 'Registrar Lançamento'}
      </button>
    </form>
  )
}
