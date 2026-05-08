import { Router } from "express";
import {
  login,
  logout,
  me,
  refreshToken,
  register,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
