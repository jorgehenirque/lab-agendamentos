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
}

interface Appointment {
  id: string
  status: string
  valor_pago: number
  exam: Exam
  slot: Slot
}

const statusColor: Record<string, string> = {
  AGENDADO: 'bg-blue-50 text-blue-700 border border-blue-200',
  CONCLUIDO: 'bg-green-50 text-green-700 border border-green-200',
  CANCELADO: 'bg-red-50 text-red-700 border border-red-200',
  REMARCADO: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
}

export default function Agendamentos() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [examSelecionado, setExamSelecionado] = useState('')
  const [slotSelecionado, setSlotSelecionado] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    const [resApp, resExams, resSlots] = await Promise.all([
      api.get('/appointments'),
      api.get('/exams'),
      api.get('/slots')
    ])
    setAppointments(resApp.data)
    setExams(resExams.data)
    setSlots(resSlots.data.filter((s: Slot) => s.status === 'DISPONIVEL'))
  }

  const handleAgendar = async () => {
    if (!examSelecionado || !slotSelecionado) {
      setErro('Selecione um exame e um horário')
      return
    }
    try {
      await api.post('/appointments', { exam_id: examSelecionado, slot_id: slotSelecionado })
      setMensagem('Agendamento realizado com sucesso!')
      setErro('')
      setExamSelecionado('')
      setSlotSelecionado('')
      carregarDados()
    } catch (error) {
      const err = error as any
      setErro(err.response?.data?.error || 'Erro ao agendar')
    }
  }

  const handleCancelar = async (id: string) => {
    try {
      await api.delete(`/appointments/${id}`)
      setMensagem('Agendamento cancelado!')
      carregarDados()
    } catch {
      setErro('Erro ao cancelar')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
  <div className="max-w-4xl mx-auto flex justify-between items-center">
    <div>
      <h1 className="text-lg font-semibold text-gray-900"> Agendamentos</h1>
      <p className="text-sm text-gray-500">Olá, {user.nome}</p>
    </div>
    <div className="flex gap-3">
      {user.role === 'ADMIN' && (
        <a href="/admin" className="text-sm text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200">
          Painel Admin
        </a>
      )}
      <a href="/perfil" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
        Meu perfil
      </a>
      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
      >
        Sair
      </button>
    </div>
  </div>
</header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Mensagens */}
        {mensagem && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {mensagem}
          </div>
        )}
        {erro && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {erro}
          </div>
        )}

        {/* Novo agendamento */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Novo agendamento</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exame</label>
              <select
                value={examSelecionado}
                onChange={(e) => setExamSelecionado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um exame</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.nome} — R$ {exam.preco.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
              <select
                value={slotSelecionado}
                onChange={(e) => setSlotSelecionado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um horário</option>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {new Date(slot.data_hora).toLocaleString('pt-BR')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAgendar}
            className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Agendar
          </button>
        </div>

        {/* Lista de agendamentos */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Meus agendamentos</h2>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{app.exam.nome}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(app.slot.data_hora).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    R$ {app.valor_pago.toFixed(2)}
                  </p>
                  <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[app.status]}`}>
                    {app.status}
                  </span>
                </div>
                {app.status === 'AGENDADO' && (
                  <button
                    onClick={() => handleCancelar(app.id)}
                    className="text-sm text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-red-200"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}