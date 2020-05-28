import {Arianee, NETWORK} from "@arianee/arianeejs";
import {createRequestFromPathAndMethod, pathFinderFromWallet} from "./libs/arianee-path-finder";

const express = require("express");

const bodyParser = require("body-parser");
const cors = require('cors')

export const arianeeServerFactory = async (configuration: {
    privateKey?: string
    chain: NETWORK,
    apiKey?: string,
    useBDH?: string,
    middlewareBefore?: Function
    middlewareAfter?: Function,
    customSendTransaction?:(transaction)=>Promise<any>
}) => {
  const app = express();
    process.env.apiKey = configuration.apiKey;


    const arianee = await new Arianee().init(configuration.chain);
    let wallet = configuration.privateKey ?
        arianee.fromPrivateKey(configuration.privateKey)
        : arianee.fromRandomKey();

    console.log("Wallet initialized on: ", configuration.chain);
    console.log('public key:', wallet.publicKey);


    if (configuration.useBDH) {
        wallet.useBDHVault(configuration.useBDH);
    }
    if (configuration.customSendTransaction) {
        wallet.setCustomSendTransaction(configuration.customSendTransaction);
    }
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    if (configuration.middlewareBefore) {
        app.use(configuration.middlewareBefore);
    }

    app.use((req,res,next)=>{
      if(configuration.privateKey){
        next();
      }
      else{
        wallet = arianee.fromRandomKey();
        next();
      }
    });


    app.get('/hello', (req, res) => {
        return res.send('world');
    });

    app.post('/chain', (req, res) => {
        return res.json({
            chainId:wallet.configuration.chainId,
            chain:configuration.chain,
            network:configuration.chain
        });
    });
    [
        {
            path: '/publicKey',
            method: createRequestFromPathAndMethod(() => wallet.publicKey)
        },
        ...pathFinderFromWallet(wallet.methods)
    ]
        .forEach(method => {
            app.post(method.path, method.method)
        });

    if (configuration.middlewareAfter) {
        app.use(configuration.middlewareAfter)
    }

    return app;
};
