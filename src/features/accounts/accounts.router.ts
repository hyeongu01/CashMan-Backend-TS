import { Router } from "express";
import {authJwt} from "@common/auth/passport";
import * as controller from "./accounts.controller";

const router = Router();

router.get("/", authJwt, controller.getAllMyAccounts);

export default router;
