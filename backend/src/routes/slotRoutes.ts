import { Router } from "express";
import { createSlot, listSlots } from "../controllers/slotController";

const router = Router()
router.post('/', createSlot)
router.get('/', listSlots)

export default router