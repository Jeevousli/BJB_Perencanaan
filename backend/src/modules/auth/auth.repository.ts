import prisma from '../../config/database';

export const findUserByUsername = async (username: string) => {
    return prisma.user.findUnique({
        where: { username },
    })
}

