import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import examRoutes from './routes/examRoutes'
import slotRoutes from './routes/slotRoutes'
import appointmentRoutes from './routes/appointmentRoutes'
import cors from 'cors'


dotenv.config()


const app = express()

app.use(express.json())
app.use(cors({
  origin: 'https://lab-agendamentos.vercel.app/',
  credentials: true
}))
app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/exams', examRoutes)
app.use('/slots', slotRoutes)
app.use('/appointments', appointmentRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' })
})

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

export default app