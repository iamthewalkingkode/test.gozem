import { Socket } from "dgram";
import logger from "./middlewares/logger.middleware";
import { DeliveryStatus } from "@prisma/client";
import { deliveryService } from "./services";

// start socket
const socketIO = (io: any) => {
    io.on('connection', (socket: Socket) => {
        logger.warn(`🚀 Socket.io connected`);

        // Incoming event for 'status_changed'. When message is received, the info is emited/sent to the tracker then the delivery's status is updated.
        socket.on(`status_changed`, async (payload: { delivery_id: string; status: DeliveryStatus; }) => {
            io.emit('delivery_updated', payload);
            await deliveryService.update(payload.delivery_id, payload);
        });

        // Incoming event for 'location_changed'. When message is received, the info is emited/sent to the tracker then the delivery's location is updated.
        socket.on(`location_changed`, async (payload: { delivery_id: string; location: any; }) => {
            io.emit('delivery_updated', payload);
            await deliveryService.update(payload.delivery_id, payload);
        });
    });
};

export default socketIO;