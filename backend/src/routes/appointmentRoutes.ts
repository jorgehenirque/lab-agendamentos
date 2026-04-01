import { Router } from "express";
import { createAppointment, listAppointments } from "../controllers/appointmentController";
import { authenticate as authMiddleware } from "../middlewares/authMiddleware";
import { cancelAppointment } from "../controllers/appointmentController";



const router = Router()
router.post('/', authMiddleware, createAppointment)
router.get('/', authMiddleware, listAppointments)
router.delete('/:id', authMiddleware, cancelAppointment)
export default router