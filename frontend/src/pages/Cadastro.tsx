import { useState } from 'react'
import api from '../services/api'

const campos = [
  { name: 'nome', label: 'Nome completo', type: 'text', placeholder: 'João Silva' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'seu@email.com' },
  { name: 'senha', label: 'Senha', type: 'password', placeholder: '••••••••' },
  { name: 'cpf', label: 'CPF', type: 'text', placeholder: '00000000000' },
  { name: 'data_nascimento', label: 'Data de nascimento', type: 'date', placeholder: '' },
  { name: 'telefone', label: 'Telefone', type: 'text', placeholder: '81999999999' },
]

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', cpf: '', data_nascimento: '', telefone: ''
  })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCadastro = async () => {
    try {
      await api.post('/auth/register', form)
      setSucesso('Cadastro realizado com sucesso!')
      setTimeout(() => { window.location.href = '/login' }, 2000)
    } catch (error) {
      const err = error as any
      setErro(err.response?.data?.error || 'Erro ao cadastrar')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Criar conta</h1>
          <p className="text-gray-500 mt-1">Preencha seus dados para se cadastrar</p>
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {sucesso}
          </div>
        )}

        <div className="space-y-4">
          {campos.map((campo) => (
            <div key={campo.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input
                type={campo.type}
                name={campo.name}
                value={form[campo.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={campo.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleCadastro}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mt-6"
        >
          Cadastrar
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem conta?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Entrar
          </a>
        </p>
      </div>
    </div>
  )
}