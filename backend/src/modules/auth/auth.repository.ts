import prisma from '../../config/database';

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email },
    })
}

