
import {Router} from "express";
import {authJwt} from "@common/auth/passport";
import * as controller from "./categories.controller";

const router = Router();

router.post('/', authJwt, controller.createCategory);
router.get("/", authJwt, controller.getMyCategories);
router.patch("/:categoryId", authJwt, controller.updateCategory);


export default router;
