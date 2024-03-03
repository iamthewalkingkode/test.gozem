import { number, object, string } from 'yup';
import { msg } from '@/utils';

export const DeliveryQuery = object({
    query: object({
        cursor: string().typeError(msg.string('cursor')),
    }),
});

export const DeliveryCreateBody = object({
    body: object({
        weight: number().typeError(msg.number('weight')).integer().required(msg.required('weight')),
        width: number().typeError(msg.number('width')).integer().required(msg.required('width')),
        height: number().typeError(msg.number('height')).integer().required(msg.required('height')),
        depth: number().typeError(msg.number('depth')).integer().required(msg.required('depth')),
        description: string().typeError(msg.string('description')).required(msg.required('description')),
        from_name: string().typeError(msg.string('from_name')).required(msg.required('from_name')),
        from_address: string().typeError(msg.string('from_address')).required(msg.required('from_address')),
        from_location: object().typeError(msg.object('from_location')).required(msg.required('from_location')),
        to_name: string().typeError(msg.string('to_name')).required(msg.required('to_name')),
        to_address: string().typeError(msg.string('to_address')).required(msg.required('to_address')),
        to_location: object().typeError(msg.object('to_location')).required(msg.required('to_location')),
    }),
});

export const DeliveryUpdateBody = object({
    params: object({
        id: string().typeError(msg.string('id')),
    }),
    body: object({
        weight: number().typeError(msg.number('weight')).integer(),
        width: number().typeError(msg.number('width')).integer(),
        height: number().typeError(msg.number('height')).integer(),
        depth: number().typeError(msg.number('depth')).integer(),
        description: string().typeError(msg.string('description')),
        from_name: string().typeError(msg.string('from_name')),
        from_address: string().typeError(msg.string('from_address')),
        from_location: object().typeError(msg.object('from_location')),
        to_name: string().typeError(msg.string('to_name')),
        to_address: string().typeError(msg.string('to_address')),
        to_location: object().typeError(msg.object('to_location')),
    }),
});
