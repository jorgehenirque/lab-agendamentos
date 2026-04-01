import { Request, Response } from "express";
import prisma from "../prisma";

export const createSlot = async (req: Request, res: Response) => {
  try {
    const { exam_id, data_hora, status } = req.body
    if (!exam_id || !data_hora || !status) {
      return res.status(400).json({ error: "Dados inválidos" })
    }
 const slot = await prisma.availableSlot.create({
  data: {
    exam_id,
    data_hora: new Date(data_hora),
    status
  }
})

    res.status(201).json(slot)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to create slot" })
  }
}

export const listSlots = async (req: Request, res: Response) => {
  try {
    const slots = await prisma.availableSlot.findMany({
      include: {
        exam: true
      }
    })
    res.json(slots)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}