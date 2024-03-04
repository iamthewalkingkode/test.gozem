import { Delivery, DeliveryStatus, PrismaClient } from '@prisma/client';
import { helpers, msg, types } from '@/utils/index';
import moment from 'moment';

const prisma = new PrismaClient();

// to fetch delivery details by `delivery_id` or throw an error if the ID is not found
export const findOrThrow = async (delivery_id: string, error = true) => {
    const row = await prisma.delivery.findFirst({
        where: {
            delivery_id,
        },
        include: {
            package: true,
        }
    });
    if (error && !row) {
        helpers.throwError(types.HttpStatus.NotFound, msg.notFound(`delivery_id: ${delivery_id}`));
    }
    return row;
}

// to update delivery details
export const update = async (id: string, payload: { status?: DeliveryStatus; location?: any }) => {
    const row = await findOrThrow(id);
    let dataToUpdate: Partial<Delivery> = {
        status: (payload.status || row.status),
        location: (payload.location || row.location),
    }
    if (payload.status === DeliveryStatus.PICKED_UP) {
        dataToUpdate['pickup_time'] = moment().format() as any;
    }
    if (payload.status === DeliveryStatus.IN_TRANSIT) {
        dataToUpdate['start_time'] = moment().format() as any;
    }
    if ([DeliveryStatus.FAILED, DeliveryStatus.DELIVERED].includes(payload.status as any)) {
        dataToUpdate['end_time'] = moment().format() as any;
    }
    await prisma.delivery.update({
        where: { delivery_id: id },
        data: dataToUpdate,
    });
}