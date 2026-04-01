import { useEffect, useState } from 'react'
import api from '../services/api'

interface Exam {
  id: string
  nome: string
  descricao: string
  preco: number
  duracao_minutos: number
}

interface Slot {
  id: string
  data_hora: string
  status: string
  exam: Exam
}

export default function Admin() {
  const [exams, setExams] = useState<Exam[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [aba, setAba] = useState<'exams' | 'slots'>('exams')
  const [mensagem, setMensagem] = useState('')

  const [novoExame, setNovoExame] = useState({
    nome: '', descricao: '', preco: '', duracao_minutos: ''
  })

  const [novoSlot, setNovoSlot] = useState({
    exam_id: '', data_hora: '', status: 'DISPONIVEL'
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    const [resExams, resSlots] = await Promise.all([
      api.get('/exams'),
      api.get('/slots')
    ])
    setExams(resExams.data)
    setSlots(resSlots.data)
  }

  const handleCriarExame = async () => {
    try {
      await api.post('/exams', {
        ...novoExame,
        preco: parseFloat(novoExame.preco),
        duracao_minutos: parseInt(novoExame.duracao_minutos)
      })
      setMensagem('Exame criado com sucesso!')
      setNovoExame({ nome: '', descricao: '', preco: '', duracao_minutos: '' })
      carregarDados()
    } catch (error) {
      const err = error as any
      setMensagem(err.response?.data?.error || 'Erro ao criar exame')
    }
  }

  const handleCriarSlot = async () => {
    try {
      await api.post('/slots', novoSlot)
      setMensagem('Horário criado com sucesso!')
      setNovoSlot({ exam_id: '', data_hora: '', status: 'DISPONIVEL' })
      carregarDados()
    } catch (error) {
      const err = error as any
      setMensagem(err.response?.data?.error || 'Erro ao criar horário')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
  <div className="max-w-5xl mx-auto flex justify-between items-center">
    <div className="flex items-center gap-3">
      <a
        href="/agendamentos"
        className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
      >
        {''} Voltar
      </a>
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Painel Admin</h1>
        <p className="text-sm text-gray-500">Gerenciar exames e horários</p>
      </div>
    </div>
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
    >
      Sair
    </button>
  </div>
</header>
      
      <main className="max-w-5xl mx-auto px-6 py-8">
        {mensagem && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {mensagem}
          </div>
        )}

        {/* Abas */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAba('exams')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${aba === 'exams' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Exames
          </button>
          <button
            onClick={() => setAba('slots')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${aba === 'slots' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Horários
          </button>
        </div>

        {aba === 'exams' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Formulário novo exame */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Novo exame</h2>
              <div className="space-y-3">
                {[
                  { name: 'nome', label: 'Nome', placeholder: 'Hemograma Completo' },
                  { name: 'descricao', label: 'Descrição', placeholder: 'Descrição do exame' },
                  { name: 'preco', label: 'Preço (R$)', placeholder: '45.90' },
                  { name: 'duracao_minutos', label: 'Duração (min)', placeholder: '30' },
                ].map((campo) => (
                  <div key={campo.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
                    <input
                      type="text"
                      value={novoExame[campo.name as keyof typeof novoExame]}
                      onChange={(e) => setNovoExame({ ...novoExame, [campo.name]: e.target.value })}
                      placeholder={campo.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleCriarExame}
                className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Criar exame
              </button>
            </div>

            {/* Lista de exames */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Exames cadastrados</h2>
              <div className="space-y-3">
                {exams.map((exam) => (
                  <div key={exam.id} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-900">{exam.nome}</p>
                    <p className="text-xs text-gray-500 mt-0.5">R$ {exam.preco.toFixed(2)} · {exam.duracao_minutos} min</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {aba === 'slots' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Formulário novo slot */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Novo horário</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exame</label>
                  <select
                    value={novoSlot.exam_id}
                    onChange={(e) => setNovoSlot({ ...novoSlot, exam_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um exame</option>
                    {exams.map((exam) => (
                      <option key={exam.id} value={exam.id}>{exam.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e hora</label>
                  <input
                    type="datetime-local"
                    value={novoSlot.data_hora}
                    onChange={(e) => setNovoSlot({ ...novoSlot, data_hora: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleCriarSlot}
                className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Criar horário
              </button>
            </div>

            {/* Lista de slots */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Horários cadastrados</h2>
              <div className="space-y-3">
                {slots.map((slot) => (
                  <div key={slot.id} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{slot.exam.nome}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(slot.data_hora).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${slot.status === 'DISPONIVEL' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {slot.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}