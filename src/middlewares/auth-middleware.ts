export const AuthByApiKey=(apiKey)=>(request,response,next)=>{
    const apiKeyInHeader=request.headers.authorization && request.headers.authorization.split('Basic ')[1]
    if(apiKey===apiKeyInHeader){
        return next()
    }else{
        return response.status(401).send('not allowed');
    }
}
