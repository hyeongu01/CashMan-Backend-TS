import express from "express";
import authRouter from "./auth/auth.router";
import testRouter from "./test/test.router";
import usersRouter from "./users/users.router";
import accountsRouter from "./accounts/accounts.router";
import categoriesRouter from "./categories/categories.router";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/accounts", accountsRouter);
router.use("/categories", categoriesRouter);
router.use("/test", testRouter);

export default router;
