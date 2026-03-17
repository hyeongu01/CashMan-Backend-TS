import express from "express";
import * as controller from "./auth.controller";
import {authJwt} from "@common/auth/passport";

const router = express.Router();

router.get("/naver/callback", controller.naverLogin);       // 없앨 예정
router.get("/naver/login", controller.naverRedirect);
// router.post("/login")
router.post("/refresh", controller.refresh);
router.post("/logout", authJwt, controller.logout);

export default router;
