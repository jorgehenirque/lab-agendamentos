import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Agendamentos from './pages/Agendamentos'
import RotaPrivada from './components/RotaPrivada'
import './index.css'
import Perfil from './pages/Perfil'
import Admin from './pages/Admin'
import RotaAdmin from './components/RotaAdmin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/perfil" element={
            <RotaPrivada>
              <Perfil />
                </RotaPrivada>
            } />
        <Route path="/agendamentos" element={
          <RotaPrivada>
            <Agendamentos />
          </RotaPrivada>
        } />
        <Route path="/admin" element={
          <RotaAdmin>
            <Admin />
          </RotaAdmin>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)