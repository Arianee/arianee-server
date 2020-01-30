const {JWT} = require('jose')

export const isJWTAuthValid=(request,response,next)=>{
    if(process.env.authPubKey){
        try{
            console.log(request.token)
            JWT.verify(request.token,process.env.authPubKey);
            const decode=JWT.decode(request.token);
            console.log(decode)
            next();
        }catch{
            response.status(401).send('not allowed')
        }
    }else{
        next();
    }

}
