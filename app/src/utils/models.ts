export interface Package {
    package_id: string;
    description: string;
    weight: number;
    width: number;
    height: number;
    depth: number;
    from_name: string;
    from_address: string;
    from_location: Location;
    to_name: string;
    to_address: string;
    to_location: Location;
    delivery: Delivery;
    created_at: string;
    updated_at: string;
}


export interface Delivery {
    delivery_id: string
    package_id: String;
    pickup_time: string;
    start_time: string;
    end_time: string;
    location: Location;
    status: DeliveryStatus;
    package: Package;
    created_at: string;
    updated_at: string;
}

export interface Location {
    lat: number;
    lng: number;
    icon?: string;
    label?: string;
}

export enum DeliveryStatus {
    OPEN = 'OPEN',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    FAILED = 'FAILED',
}

export interface Meta {
    next: string;
    page: number;
    previous: string;
    total: number;
}

export enum ioEvents {
    status_changed = 'status_changed',
    location_changed = 'location_changed',
    delivery_updated = 'delivery_updated',
}

export interface ioPayload {
    status?: DeliveryStatus;
    location?: Location;
    delivery_id: string;
    end_time?: string;
    start_time?: string;
    pickup_time?: string;
}