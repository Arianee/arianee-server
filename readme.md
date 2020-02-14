[![Build Status](https://travis-ci.org/Arianee/arianee-server.svg?branch=master)](https://travis-ci.org/Arianee/arianee-server)


### What is it?

use arianeejs with http

post(nameOfMethod,[params])

ex post('url.com/requestPoa)


### process.env

process.env.useBDH => url of bdh to use bdh vault
apiKey => to pass in header
chain => testnet, mainnet...etc
privateKey => private key of wallet

---
title: Wallet
sidebar_label: Wallet
---

### Authentification with ApiKey
To interact with Arianee-server, you need a an apiKey. and pass it in header field authorization
```bash
curl GET https://arianeeexample.cleverapps.io/hello -H "authorization: Basic YourApiKey"
// output: world
```

### Calling methods

All methods available in arianeeJS's wallet object can be called in http.
Obviously you cannot call method like ``fromRandomKey``, or ``useBDH``. These methods are set with environment variables.

### List of availables endpoints
- GET /hello
- POST /publicKey
- POST /createCertificate
- POST /getMyCertificates
- POST /getCertificate
- POST /requestPoa
- POST /requestAria
- POST /approveStore
- POST /refuseArianeeEvent
- POST /requestCertificateOwnership
- POST /getMessageSenders
- POST /acceptArianeeEvent
- POST /createCertificateRequestOwnershipLink
- POST /storeContentInRPCServer
- POST /setMessageAuthorizationFor
- POST /getIdentity
- POST /getMyCertificatesGroupByIssuer
- POST /isCertificateOwnershipRequestable
- POST /isCertificateProofValid
- POST /getCertificateFromLink
- POST /buyCredits
- POST /balanceOfAria
- POST /balanceOfPoa
- POST /storeArianeeEvent
- POST /createCertificateProofLink
- POST /createArianeeEvent

### Methods, endpoints and parameters

## Method without parameters
For method without parameter, just call method with empty parameters
```bash
curl -H Content-Type:application/json -H "authorization: Basic YourApiKey" POST https://arianeeexample.cleverapps.io/publicKey 
// output: 0xAC6943CEA275E8392c49905c960e580CfEaC0bd5
```

## Method with parameters
You just need to pass data as an array. Parameters are exactly the same as arianeeJS doc.
```bash
curl POST https://arianeeexample.cleverapps.io/buyCredits -H Content-Type:application/json -H "authorization: Basic YourApiKey" -d "["certificate",1]"
```


### Example

## Create event: createArianeeEvent
```bash
curl POST https://arianeeexample.cleverapps.io/createArianeeEvent -H Content-Type:application/json -H "authorization: Basic YourApiKey" 
-d "[{certificateId:certificateId,
                   content:{
                       $schema:'https://cert.arianee.org/version1/ArianeeEvent-i18n.json',
                       title:'My Title'
                   }
               }]"
```

## store Arianee event content: storeArianeeEvent
```bash
curl POST https://arianeeexample.cleverapps.io/storeArianeeEvent -H Content-Type:application/json -H "authorization: Basic YourApiKey" 
-d "["YourCertificateId",yourArianeeEventId,"yourArianeeEventContent","https://arianee.cleverapps.io/arianeetestnet/rpc"]"
```


## Middleware logs

You can log before and after request:

```javascript
app.logBefore=(req,res,next)=>{
    console.log("before");
    next();
}

app.logAfter=(req,res,next)=>{
    console.log("after");

    console.log(req.inError) // careful with error. Sometimes they are not well propagated
    next();
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```
