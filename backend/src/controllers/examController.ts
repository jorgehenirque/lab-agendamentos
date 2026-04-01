import { Request, Response } from 'express'
import prisma from '../prisma'

export const listExams = async (req: Request, res: Response) => {
  try {
    const exams = await prisma.exam.findMany()

    return res.status(200).json(exams)

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export const createExam = async (req: Request, res: Response) => {
  try {
    const { nome, descricao, preco, duracao_minutos } = req.body

 if (!nome || !descricao || !preco || !duracao_minutos) { return res.status(400).json({ error: 'Campos obrigatórios faltando' }) }
  const exam = await prisma.exam.create({
  data: {
    nome, 
    descricao, 
    preco, 
    duracao_minutos
  }
})
  return res.status(201).json({
      message: 'Exame criado com sucesso',
      exam: {
        id: exam.id,
        nome: exam.nome,
        descricao: exam.descricao,
        preco: exam.preco,
        duracao_minutos: exam.duracao_minutos
      }
    })
}catch (error) {
  return res.status(500).json({ error: 'Erro interno do servidor' })
}
}
 


