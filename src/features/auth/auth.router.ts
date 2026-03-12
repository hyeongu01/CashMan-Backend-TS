import express from "express";
import * as controller from "./auth.controller";

const router = express.Router();

router.get("/naver/callback", controller.naverLogin);
// router.post("/login")
// router.post("/refresh")
// router.post("/logout")

export default router;
