import {Router} from "express";
import {authJwt} from "@common/auth/passport";
import * as controller from "./transactions.controller";

const router = Router();

router.post('/', authJwt, controller.createTransaction);
router.get("/", authJwt, controller.findAllMyTransactions);
router.get("/:transactionId", authJwt, controller.findMyTransaction);
router.patch("/:transactionId", authJwt, controller.updateMyTransaction);
router.delete("/:transactionId", authJwt, controller.deleteMyTransaction);

export default router;
