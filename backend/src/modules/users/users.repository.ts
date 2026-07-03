import prisma from "../../config/database";

// ambil semua user tanpa PW
export const findAllUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
        }
    })
}

// ambil berdasarkan id

export const findUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true

        }
    })
}
// buat user baru
// baut user baru 
export const createUser = async (data: any) => {
    return prisma.user.create({
        data,
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true
        }
    })
}

//navbar user bag

export const updateUser = async (id: string, data: any) => {
    return prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            username: true,
            email: true,
            role: true,

        }

    })
}

export const deleteUser = async (id: string) => {
    return prisma.user.delete({ where: { id } })
}