import type {Response, Request} from "express";
import {customError, makeResponse} from "@common/CustomResponse";
import {
    type Category,
    validateCreateCategoryRequestBody, validateUpdateCategoryParams
} from "@features/categories/categories.dto";
import * as repository from "./categories.repository";
import * as service from "./categories.service";

export async function createCategory(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const params = req.body;

    if (!user) throw customError.UNAUTHORIZED();
    if (!validateCreateCategoryRequestBody(params)) throw customError.BAD_REQUEST();

    const data: Category = await repository.createCategory(user.id, params);
    return res.status(200).json(makeResponse({data}));
}

export async function getMyCategories(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const raw = req.query.groupType;
    const groupType: number | undefined = typeof raw === "string" && raw !== "" ? Number(raw) : undefined;

    if (!user) throw customError.UNAUTHORIZED();
    if (Number.isNaN(groupType)) throw customError.BAD_REQUEST();

    const data: Category[] = await repository.findCategories(user.id, groupType);
    return res.status(200).json(makeResponse({
        data,
        meta: {
            count: data.length,
            groupType: groupType === undefined ? undefined : groupType,
        }
    }));
}

export async function updateCategory(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const params = req.body;
    const {categoryId} = req.params;

    if (!user) throw customError.UNAUTHORIZED();
    if (!validateUpdateCategoryParams(params)) throw customError.BAD_REQUEST();
    if (categoryId === undefined || typeof categoryId !== "string")
        throw customError.BAD_REQUEST();

    const data: Category = await service.updateCategory(user, categoryId, params);
    return res.status(200).json(makeResponse({data}));
}
