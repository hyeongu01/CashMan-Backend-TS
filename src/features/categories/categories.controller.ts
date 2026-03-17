import type {Response, Request} from "express";
import {customError, makeResponse} from "@common/CustomResponse";
import {
    Category,
    CreateCategoryRequestBody,
    validateCreateCategoryRequestBody
} from "@features/categories/categories.dto";
import * as repository from "./categories.repository";

export async function createCategory(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const params = req.body;

    if (!user) throw customError.UNAUTHORIZED();
    if (!validateCreateCategoryRequestBody(params)) throw customError.BAD_REQUEST();

    const data: Category = await repository.createCategory(user.id, params);
    return res.status(200).json(makeResponse({data}));
}
