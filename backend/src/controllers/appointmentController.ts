import { Response } from 'express'
import { AuthRequest } from '../middlewares/authMiddleware'
import prisma from '../prisma'


export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { exam_id, slot_id } = req.body

    if (!exam_id || !slot_id) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    // passo 1: verificar se o exame existe
    const exam = await prisma.exam.findUnique({ where: { id: exam_id } })
    if (!exam) {
      return res.status(404).json({ error: 'Exame não encontrado' })
    }

    // passo 2: verificar se o slot existe e está disponível
    const slot = await prisma.availableSlot.findUnique({ where: { id: slot_id } })
    if (!slot) {
      return res.status(404).json({ error: 'Horário não encontrado' })
    }
    if (slot.status !== 'DISPONIVEL') {
      return res.status(409).json({ error: 'Horário já ocupado' })
    }

    // passo 3: criar o agendamento e ocupar o slot
    const appointment = await prisma.appointment.create({
      data: {
        user_id: req.userId!,
        exam_id,
        slot_id,
        valor_pago: exam.preco
      }
    })

    await prisma.availableSlot.update({
      where: { id: slot_id },
      data: { status: 'OCUPADO' }
    })

    return res.status(201).json({
      message: 'Agendamento criado com sucesso',
      appointment
    })

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
export const listAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({  
        where: { user_id: req.userId },
    include: {
    exam: true,
    slot: true
  }}
    
    )  
return res.status(200).json(appointments)
    } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }}

  export const cancelAppointment = async (req: AuthRequest, res: Response) => {

    try{
        const { id } = req.params
        const appointment = await prisma.appointment.findUnique({ where: { id: String(id) } })
        if (!appointment) {
            return res.status(404).json({ error: 'Agendamento não encontrado' })
        }
        if (appointment.user_id !== req.userId) {
            return res.status(403).json({ error: 'Acesso negado' })
        }
        await prisma.appointment.update({
    where: { id: String(id) },
    data: {
    status: 'CANCELADO',
    deleted_at: new Date()
  }
})

return res.status(200).json({ message: 'Agendamento cancelado com sucesso' })
    
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }}