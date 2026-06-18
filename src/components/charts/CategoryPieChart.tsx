'use client'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface Item {
  name: string
  value: number
  color: string
  icon: string
}

interface Props {
  data: Item[]
  title: string
}

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function CategoryPieChart({ data, title }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">{title}</h3>
        <p className="text-gray-500 text-sm text-center py-8">Nenhuma despesa registrada</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => fmt(value)}
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#9ca3af' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-xs text-gray-400">{item.icon} {item.name}</span>
            </div>
            <span className="text-xs font-semibold text-white">{fmt(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
