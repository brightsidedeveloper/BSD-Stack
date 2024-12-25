import { HealthResponse } from '../types/request';
declare class Get {
    static healthCheck(): Promise<HealthResponse>;
}
export default class Bright {
    static get: typeof Get;
}
export {};
