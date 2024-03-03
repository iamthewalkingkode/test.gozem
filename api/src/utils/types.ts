
export interface Error {
    status: HttpStatus;
    message: string;
}

export enum HttpStatus {
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Success = 200,
    Created = 201,
    InternalServerError = 500,
}
