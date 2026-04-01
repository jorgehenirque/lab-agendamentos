import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../prisma'
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, cpf, rg, data_nascimento, telefone, endereco } = req.body

    if (!nome || !email || !senha || !cpf || !data_nascimento || !telefone) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' })
    }

    const emailExistente = await prisma.user.findUnique({ where: { email } })
    if (emailExistente) {
      return res.status(409).json({ error: 'Email já cadastrado' })
    }

    const cpfExistente = await prisma.user.findUnique({ where: { cpf } })
    if (cpfExistente) {
      return res.status(409).json({ error: 'CPF já cadastrado' })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        cpf,
        rg,
        data_nascimento: new Date(data_nascimento),
        telefone,
        endereco
      }
    })

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    })

} catch (error) {
  console.error('Erro no register:', error)
  return res.status(500).json({ error: 'Erro interno do servidor' })
}
  
}
export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha obrigatórios' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const senhaValida = await bcrypt.compare(senha, user.senha)
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    )

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
