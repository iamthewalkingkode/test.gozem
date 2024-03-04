import { PrismaClient } from '@prisma/client';
import { helpers, msg, types } from '@/utils/index';

const prisma = new PrismaClient();

// to fetch package details by `package_id` or throw an error if the ID is not found
export const findOrThrow = async (package_id: string, error = true) => {
    const row = await prisma.package.findFirst({
        where: {
            package_id,
        },
        include: {
            delivery: true,
        }
    });
    if (error && !row) {
        helpers.throwError(types.HttpStatus.NotFound, msg.notFound(`package_id: ${package_id}`));
    }
    return { ...row, delivery: row.delivery[0] };
}