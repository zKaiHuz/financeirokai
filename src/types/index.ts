export type LayerType = 'PF' | 'PJ'
export type TransactionType = 'receita' | 'despesa' | 'transferencia'

export interface Layer {
  id: string
  name: string
  type: LayerType
}

export interface Category {
  id: string
  name: string
  layer_type: 'PF' | 'PJ' | 'BOTH'
  icon: string
  color: string
}

export interface Transaction {
  id: string
  layer_id: string
  category_id: string
  type: TransactionType
  amount: number
  description: string
  date: string
  source: 'web' | 'whatsapp'
  created_at: string
  layers?: Layer
  categories?: Category
}

export interface Prolabore {
  id: string
  amount: number
  month: string
  status: 'pendente' | 'pago'
  paid_at: string | null
  notes: string | null
  created_at: string
}
