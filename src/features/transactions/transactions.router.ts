import {Router} from "express";
import {authJwt} from "@common/auth/passport";
import * as controller from "./transactions.controller";

const router = Router();

router.post('/', authJwt, controller.createTransaction);
router.get("/", authJwt, controller.findAllMyTransactions);

export default router;
