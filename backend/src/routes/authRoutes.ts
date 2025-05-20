import { Router } from "express";
import { simpleLogin, registerUser } from "../controllers/authController";

const router = Router();

router.post("/simple-login", simpleLogin);
router.post("/register", registerUser);
export default router;
