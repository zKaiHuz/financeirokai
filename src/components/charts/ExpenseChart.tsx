'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Props {
  data: { name: string; value: number; color: string }[]
}

export default function ExpenseChart({ data }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-4">Despesas por Categoria</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
