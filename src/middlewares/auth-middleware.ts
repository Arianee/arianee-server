export const AuthByApiKey=(request,response,next)=>{
   const apiKey= process.env.apiKey
console.log("herer")
    console.log(apiKey)
    const apiKeyInHeader=request.headers.authorization && request.headers.authorization.split('Basic ')[1]

    console.log(apiKeyInHeader,apiKey)
    if(!apiKey){
        return next();
    }
    if(apiKey===apiKeyInHeader){
        return next()
    }else{
        return response.status(401).send('not allowed');
    }
}
