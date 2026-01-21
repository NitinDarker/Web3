import { Router } from "express";
import signup from "../controllers/signup";

export const router = Router();

router.post("/signup", signup);
router.post("/signin", signup);
router.post("/transaction", signup);
router.post("/transaction/sign", signup);
