import {Arianee, NETWORK} from "@arianee/arianeejs/dist/src";
import {createRequestFromPathAndMethod, pathFinderFromWallet} from "./libs/arianee-path-finder";
import axios from 'axios';
var jwt = require('express-jwt');

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 3001;
const privateKey=process.env.privateKey || '';
const chain:NETWORK=process.env.chain as NETWORK || NETWORK.arianeeTestnet;
process.env.authPubKey= 'myVerySecret'

const  makeARequest=async ()=>{
    const config={
        headers:{
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.7Lgowhhw6f-71P0UzfqhV1p0txFG22IbXYnOFiBiaNw'
        }
    };

   // const res=    await axios.get('http://localhost:3001/hello',config);
//    await axios.post('http://localhost:3001/requestPoa',undefined,config);
    const res=  await axios.post('http://localhost:3001/balanceOfPoa',undefined,config);
    console.log(res.data)
    //const pubkey=  await axios.post('http://localhost:3001/publicKey');
};

(async function() {
    const arianee = await new Arianee().init(chain);
    const wallet = privateKey?arianee.fromPrivateKey(privateKey):arianee.fromRandomMnemonic();

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(jwt({secret: process.env.authPubKey}))

    app.get('/hello',(req,res)=> {
        return res.send('world');
    });

    const othersMethods=[
    {
        path:'/requestAria',
        method: createRequestFromPathAndMethod(wallet.requestAria)
    },
    {
        path:'/requestPoa',
        method: createRequestFromPathAndMethod(wallet.requestPoa)
    },
    {
        path:'/publicKey',
        method: createRequestFromPathAndMethod(()=>wallet.publicKey)
    },
    ... pathFinderFromWallet(wallet.methods)
]
        .forEach(method=>{
            app.post(method.path,method.method)
        });

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));

    setTimeout(()=>makeARequest(),1000);

})()

