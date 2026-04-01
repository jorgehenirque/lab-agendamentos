import { useEffect, useState } from 'react'
import api from '../services/api'

interface User {
  id: string
  nome: string
  email: string
  cpf: string
  role: string
  data_nascimento: string
  telefone: string
  endereco: string
  created_at: string
}

export default function Perfil() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    api.get('/users/profile').then((res) => setUser(res.data))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Carregando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">Meu perfil</h1>
          <div className="flex gap-3">
            <a href="/agendamentos" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Agendamentos
            </a>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xl font-semibold">
                {user.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user.nome}</h2>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: 'Email', value: user.email },
              { label: 'CPF', value: user.cpf },
              { label: 'Telefone', value: user.telefone },
              { label: 'Data de nascimento', value: new Date(user.data_nascimento).toLocaleDateString('pt-BR') },
              { label: 'Endereço', value: user.endereco || 'Não informado' },
              { label: 'Membro desde', value: new Date(user.created_at).toLocaleDateString('pt-BR') },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}