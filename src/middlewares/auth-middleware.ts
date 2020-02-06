export const AuthByApiKey=(request,response,next)=>{
   const apiKey= process.env.apiKey
    const apiKeyInHeader=request.headers.authorization && request.headers.authorization.split('Basic ')[1]

    if(!apiKey){
        return next();
    }
    if(apiKey===apiKeyInHeader){
        return next()
    }else{
        return response.status(401).send('not allowed');
    }
}
