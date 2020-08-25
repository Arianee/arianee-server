export const createRequestFromPathAndMethod = (method) => async (request, response, next) => {
    try {
        let result;
        if (request.body && Array.isArray(request.body)) {
           const preparedParameters = Object.keys(request.body).length > 0 ? request.body : undefined;
            result = await method(...preparedParameters);
        }else{
            const preparedParameters=request.body;
            result = await method(preparedParameters);
        }

        response.body = JSON.parse(JSON.stringify(result));
        next();
    } catch (error) {
        response.body=error;
        response.inError = true;
        request.inError = true;

        next();
    }
};
export const pathFinderFromWallet = (listOfMethods: any): { path: string, method: any }[] => {
    let methods = [];

    const makePath = (object, path = '') => {
        return Object.getOwnPropertyNames(object)
            .forEach(prop => {
                if (typeof object[prop] === 'function') {
                    methods.push({
                        path: path + '/' + prop,
                        method: createRequestFromPathAndMethod(object[prop])
                    })
                } else {
                    return makePath(object[prop], path + '/' + prop)
                }
            })
    };

    makePath(listOfMethods);

    return methods;
};
