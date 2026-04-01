import { Navigate } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}

export default function RotaAdmin({ children }: Props) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (!token) {
    return <Navigate to="/login" />
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/agendamentos" />
  }

  return <>{children}</>
}