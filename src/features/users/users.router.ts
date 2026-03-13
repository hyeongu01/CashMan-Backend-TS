import {Router} from "express";
import * as controller from "./users.controller";
import {authJwt} from "@common/auth/passport";

const router = Router();

router.get("/me", authJwt, controller.getMyProfile);
router.patch("/me", authJwt, controller.updateMyProfile);


export default router;
