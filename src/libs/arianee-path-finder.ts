export const createRequestFromPathAndMethod = (method) => async (request, response, next) => {
    const parameters = Object.keys(request.body).length > 0 ? request.body : undefined;
    try {
        const result = await method(...parameters)

        response.body = result;
        next();
    } catch (e) {
        console.error(e);
        response.body=e.toString();
        request.inError = true;
        console.error(e);
        next();
    }
};
export const pathFinderFromWallet = (listOfMethods: any): { path: string, method: any }[] => {

    return Object.getOwnPropertyNames(listOfMethods)
        .map(methodName => {
            const method = createRequestFromPathAndMethod(listOfMethods[methodName]);
            return ({
                path: `/${methodName}`,
                method
            });
        })
};
