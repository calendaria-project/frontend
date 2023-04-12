import { TCode } from "../types";

export interface IRequestData {
    code: TCode;
    data: object | any[];
    exception: string | null;
    text: string;
    title: string;
    statusCode: number | string;
}

export interface IRequest {
    data: IRequestData;
}

export interface IActionMethodCallback {
    error: any;
    data: any;
    next?: (...args: [] | [any]) => IteratorResult<any, any>;
    /**
     * not ready
     */
    redata?: any;
}
