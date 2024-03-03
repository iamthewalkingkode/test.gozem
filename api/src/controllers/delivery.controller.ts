import express, { Request, Response } from 'express';
import yupValidator from '@/middlewares/yup.middleware';
import { helpers, msg, types } from '@/utils';
import { PrismaClient } from '@prisma/client';
import { DeliveryCreateBody, DeliveryQuery, DeliveryUpdateBody } from '@/dto/delivery.dto';
import { deliveryService, packageService } from '@/services';
import moment from 'moment';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', yupValidator(DeliveryQuery), async (req: Request, res: Response) => {
    try {
        const where = {};

        const allCount = await prisma.delivery.count({
            select: { _all: true, },
            where,
        });

        let skip = undefined;
        let take = undefined;
        let page = 1;

        if (req.query.cursor) {
            const cursor = ((req.query.cursor || '0-12') as string).split('-');
            skip = cursor[0] ? +cursor[0] : '';
            take = cursor[1] ? +cursor[1] : '';
            page = (skip / take) + 1;
        }

        const data = await prisma.delivery.findMany({
            where,
            include: { package: true },
            orderBy: { created_at: 'desc', },
            skip,
            take,
        });
        return res.status(types.HttpStatus.Success).json({
            data,
            meta: {
                page,
                next: (allCount._all / take) > page ? `${page * take},${take}` : null,
                limit: take,
                previous: page > 1 ? `${(page - 2) * take},${take}` : null,
                total: allCount._all,
            },
        });
    } catch (e) {
        helpers.catchError(res, e);
    }
});

router.post('/', yupValidator(DeliveryCreateBody), async (req: Request, res: Response) => {
    try {
        const { package_id } = req.body;
        await packageService.findOrThrow(package_id);
        const create = await prisma.delivery.create({
            data: {
                end_time: moment().format(),
                start_time: moment().format(),
                pickup_time: moment().format(),
                package_id,
            }
        });
        const data = await deliveryService.findOrThrow(create.delivery_id);
        res.status(types.HttpStatus.Created).json(data);
    } catch (e) {
        helpers.catchError(res, e);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const data = await deliveryService.findOrThrow(req.params.id);
        res.status(types.HttpStatus.Success).json(data);
    } catch (e) {
        helpers.catchError(res, e);
    }
});

router.put('/:id', yupValidator(DeliveryUpdateBody), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { location } = req.body;
        if (location && !location.lat && !location.lng && typeof location.lat !== 'number' && typeof location.lng !== 'number') {
            helpers.throwError(types.HttpStatus.BadRequest, `Invalid format for location`);
        }
        await deliveryService.update(id, req.body);
        const data = await deliveryService.findOrThrow(id);
        res.status(types.HttpStatus.Success).json(data);
    } catch (e) {
        helpers.catchError(res, e);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await deliveryService.findOrThrow(req.params.id);
        await prisma.delivery.delete({ where: { delivery_id: req.params.id } });
        res.status(types.HttpStatus.Success).json({ message: msg.deleted(`PacDeliverykage`) });
    } catch (e) {
        helpers.catchError(res, e);
    }
});


export default router;