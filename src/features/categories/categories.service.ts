import {
    type Category,
    type UpdateCategoryParams
} from "@features/categories/categories.dto";
import {type User} from "@features/users/users.dto";
import * as repository from "./categories.repository";
import {customError} from "@common/CustomResponse";

export async function updateCategory(user: User, categoryId: string, params: UpdateCategoryParams): Promise<Category> {
    const oldCategory: Category | null = await repository.findCategoryById(categoryId);

    if (!oldCategory) throw customError.NOT_FOUND("category not found");
    if (user.id !== oldCategory.userId) throw customError.FORBIDDEN();

    const overlappingCategory: Category | null = await repository.findCategoryByUserId({userId: user.id, ...params});
    if (overlappingCategory && oldCategory.id !== overlappingCategory.id) throw customError.CONFLICT("overlapping category");

    return repository.updateCategory(categoryId, params);
}
