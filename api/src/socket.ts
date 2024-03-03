import { Socket } from "dgram";
import logger from "./middlewares/logger.middleware";
import { DeliveryStatus } from "@prisma/client";
import { deliveryService } from "./services";

const socketIO = (io: Socket) => {
    io.on('connection', (socket: Socket) => {
        logger.warn(`🚀 Socket.io connected`);

        socket.on(`status_changed`, async (payload: { delivery_id: string; status: DeliveryStatus; }) => {
            io.emit('delivery_updated', payload);
            await deliveryService.update(payload.delivery_id, payload);
        });

        socket.on(`location_changed`, async (payload: { delivery_id: string; location: any; }) => {
            io.emit('delivery_updated', payload);
            await deliveryService.update(payload.delivery_id, payload);
        });
    });
};

export default socketIO;