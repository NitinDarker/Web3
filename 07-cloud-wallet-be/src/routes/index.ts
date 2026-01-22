import { Router } from "express";
import { signin, signup } from "../controllers";

export const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/transaction", signup);
router.post("/transaction/sign", signup);
