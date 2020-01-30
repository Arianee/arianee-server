
export const createRequestFromPathAndMethod=(method)=>async (request,response)=>{
    const parameters=Object.keys(request.body).length>0?request.body:undefined;
    try {
        const result=await  method(parameters);
        response.json(result)
    }catch (e) {
        response.status(500).json(e)
    }
}
export const pathFinderFromWallet=(listOfMethods:any):{path:string,method:any}[]=>{

    return  Object.getOwnPropertyNames(listOfMethods)
            .map(methodName=> {
                const method=createRequestFromPathAndMethod(listOfMethods[methodName])
                return ({
                    path: `/${methodName}`,
                    method
                });
            })
}
