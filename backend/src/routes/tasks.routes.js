import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  destroy,
  index,
  show,
  store,
  update,
} from "../controllers/task.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", index);
router.get("/:id", show);
router.post("/", store);
router.put("/:id", update);
router.delete("/:id", destroy);

export default router;
