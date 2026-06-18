'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

interface MonthData {
  month: string
  receitas: number
  despesas: number
}

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function MonthlyBarChart({ data }: { data: MonthData[] }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-4">Receitas vs Despesas (6 meses)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value: number) => fmt(value)}
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
          <Bar dataKey="receitas" fill="#10b981" radius={[4, 4, 0, 0]} name="Receitas" />
          <Bar dataKey="despesas" fill="#ef4444" radius={[4, 4, 0, 0]} name="Despesas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
