import { Router } from "express";
import { listExams } from "../controllers/examController";
import { createExam } from "../controllers/examController";

const router = Router()

router.get('/', listExams)
router.post('/', createExam)

export default router