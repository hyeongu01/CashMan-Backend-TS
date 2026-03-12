import type {ResponseUser, User} from "@features/users/users.dto";


export const userConverter = (user: User): ResponseUser => {
    const {deletedAt, ...data} = user;
    return {
        ...data,
        birthDate: data.birthDate?.toISOString().split("T")[0],
        createdAt: data.createdAt.toISOString(),
    }
}