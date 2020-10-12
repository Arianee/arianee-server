export const createRequestFromPathAndMethod = (method) => async (request, response, next) => {
    try {
        let result;

        if (request.body && Array.isArray(request.body)) {
           const preparedParameters = Object.keys(request.body).length > 0 ? request.body : undefined;
            result = await method(...preparedParameters);
        } else if (request.body && typeof request.body === "object" && Object.keys(request.body).length > 0) {
            result = await method(request.body);
        }else{
            result = await method();
        }


        response.body = JSON.parse(JSON.stringify(result));
        next();
    } catch (error) {
        console.error(error);
        response.body=error;
        response.inError = true;
        request.inError = true;

        next();
    }
};

export const pathFinderContractFromWallet = (contracts: any): { path: string, method: any }[] => {

    const contractNames = Object.keys(contracts)
        .filter(propertyName => propertyName.includes('Contract'));

    const paths = [];


    const makePath = (object, path = '', contractName: string) => {
        return Object.getOwnPropertyNames(object)
            .forEach(prop => {
                if (typeof object[prop] === 'function') {
                    const callMethod = (...args) => {
                        return object[prop](...args).call()
                    };
                    const sendMethod = (...args) => {
                        return object[prop](...args).send()
                    };

                    const call = {
                        path: `/${contractName}${path}/${prop}/call`,
                        method: createRequestFromPathAndMethod(callMethod)
                    };
                    const send = {
                        path: `/${contractName}${path}/${prop}/send`,
                        method: createRequestFromPathAndMethod(sendMethod)
                    };

                    paths.push(call);
                    paths.push(send);

                } else {
                    return makePath(object[prop], path + '/' + prop, contractName)
                }
            })
    };

    contractNames
        .forEach(contractName => {
            makePath(contracts[contractName].methods, '', contractName);
            const getPastEvent={
                path:`/${contractName}/getPastEvents`,
                method:createRequestFromPathAndMethod(contracts[contractName].getPastEvents.bind(contracts[contractName]))
            }
            paths.push(getPastEvent)
        });


    return paths;
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
