import express, { Request, Response } from 'express';
import yupValidator from '@/middlewares/yup.middleware';
import { helpers, msg, types } from '@/utils';
import { PrismaClient } from '@prisma/client';
import { DeliveryCreateBody, DeliveryQuery, DeliveryUpdateBody } from '@/dto/package.dto';
import { packageService } from '@/services';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', yupValidator(DeliveryQuery), async (req: Request, res: Response) => {
    try {
        const where = {};

        const allCount = await prisma.package.count({
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

        const data = await prisma.package.findMany({
            where,
            include: { delivery: true },
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
        const { weight, width, height, depth, from_name, from_address, from_location, to_name, to_address, to_location, description } = req.body;
        if (!from_location.lat && !from_location.lng && typeof from_location.lat !== 'number' && typeof from_location.lng !== 'number') {
            helpers.throwError(types.HttpStatus.BadRequest, `Invalid format for from_location`);
        }
        if (!to_location.lat && !to_location.lng && typeof to_location.lat !== 'number' && typeof to_location.lng !== 'number') {
            helpers.throwError(types.HttpStatus.BadRequest, `Invalid format for to_location`);
        } from_location
        const create = await prisma.package.create({
            data: {
                depth: +depth,
                description,
                from_address,
                from_name,
                height: +height,
                to_address,
                to_name,
                weight: +weight,
                width: +width,
                from_location,
                to_location,
            }
        });
        const data = await packageService.findOrThrow(create.package_id);
        res.status(types.HttpStatus.Created).json(data);
    } catch (e) {
        helpers.catchError(res, e);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const data = await packageService.findOrThrow(req.params.id);
        res.status(types.HttpStatus.Success).json(data);
    } catch (e) {
        helpers.catchError(res, e);
    }
});

router.put('/:id', yupValidator(DeliveryUpdateBody), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { weight, width, height, depth, from_name, from_address, from_location, to_name, to_address, to_location, description } = req.body;
        if (from_location && !from_location.lat && !from_location.lng && typeof from_location.lat !== 'number' && typeof from_location.lng !== 'number') {
            helpers.throwError(types.HttpStatus.BadRequest, `Invalid format for from_location`);
        }
        if (to_location && !to_location.lat && !to_location.lng && typeof to_location.lat !== 'number' && typeof to_location.lng !== 'number') {
            helpers.throwError(types.HttpStatus.BadRequest, `Invalid format for to_location`);
        }
        const row = await packageService.findOrThrow(id);
        await prisma.package.update({
            where: { package_id: id },
            data: {
                weight: +(weight || row.weight),
                width: +(width || row.width),
                height: +(height || row.height),
                depth: +(depth || row.depth),
                from_name: (from_name || row.from_name),
                from_address: (from_address || row.from_address),
                from_location: (from_location || row.from_location),
                to_name: (to_name || row.to_name),
                to_address: (to_address || row.to_address),
                to_location: (to_location || row.to_location),
                description: (description || row.description),
            }
        });
        const data = await packageService.findOrThrow(id);
        res.status(types.HttpStatus.Success).json(data);
    } catch (e) {
        helpers.catchError(res, e);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await packageService.findOrThrow(req.params.id);
        await prisma.package.delete({ where: { package_id: req.params.id } });
        res.status(types.HttpStatus.Success).json({ message: msg.deleted(`Package`) });
    } catch (e) {
        helpers.catchError(res, e);
    }
});



export default router;