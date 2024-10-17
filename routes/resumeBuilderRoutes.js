import { Router } from "express";
import path from "path";
import {postResume,getAllResume,deleteResume,updateResume,downloadResume} from "../controllers/resumeBuilderController.js"


const router = Router();


router.post("/resume", postResume);

router.get("/resumes/:userId", getAllResume);

router.delete("/resume/:id", deleteResume);

router.put("/resume/:id", updateResume);
router.post("/resume/download",downloadResume)


export default router;
