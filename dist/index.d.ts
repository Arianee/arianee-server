import { NETWORK } from "@arianee/arianeejs";
export declare const arianeeServerFactory: (configuration: {
    privateKey: string;
    chain: NETWORK;
    apiKey?: string;
    useBDH?: string;
    middlewareBefore?: Function;
    middlewareAfter?: Function;
}) => Promise<any>;
