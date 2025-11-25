import { Router } from "express";
import { createDosen } from "../dosenController";

const router = Router();

router.post("/create", createDosen);

export default router;
