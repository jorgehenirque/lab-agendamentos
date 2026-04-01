import { Response } from 'express'
import { AuthRequest } from '../middlewares/authMiddleware'
import prisma from '../prisma'

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        role: true,
        data_nascimento: true,
        telefone: true,
        endereco: true,
        created_at: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    return res.status(200).json(user)

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}