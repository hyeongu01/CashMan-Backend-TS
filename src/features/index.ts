import express from "express";
import authRouter from "./auth/auth.router";
import testRouter from "./test/test.router";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/test", testRouter);

export default router;
