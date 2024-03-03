import { object, string } from 'yup';
import { msg } from '@/utils';
import { DeliveryStatus } from '@prisma/client';

export const DeliveryQuery = object({
    query: object({
        cursor: string().typeError(msg.string('cursor')),
    }),
});

export const DeliveryCreateBody = object({
    body: object({
        package_id: string().typeError(msg.string('package_id')).required(msg.required('package_id')).min(24).max(24),
    }),
});

export const DeliveryUpdateBody = object({
    params: object({
        id: string().typeError(msg.string('id')),
    }),
    body: object({
        location: object().typeError(msg.object('location')),
        status: string().typeError(msg.string('status')).oneOf(Object.keys(DeliveryStatus), msg.oneOf('status', Object.keys(DeliveryStatus))),
    }),
});
