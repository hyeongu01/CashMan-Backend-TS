import express from "express";
import authRouter from "./auth/auth.router";
import testRouter from "./test/test.router";
import usersRouter from "./users/users.router";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/test", testRouter);

export default router;
