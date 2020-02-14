export declare const createRequestFromPathAndMethod: (method: any) => (request: any, response: any, next: any) => Promise<void>;
export declare const pathFinderFromWallet: (listOfMethods: any) => {
    path: string;
    method: any;
}[];
