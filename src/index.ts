import {Arianee, NETWORK} from "@arianee/arianeejs";
import {
    createRequestFromPathAndMethod,
    pathFinderContractFromWallet,
    pathFinderFromWallet
} from "./libs/arianee-path-finder";

const express = require("express");

const bodyParser = require("body-parser");
const cors = require('cors')

export const arianeeServerFactory = async (configuration: {
    privateKey?: string
    chain: NETWORK,
    apiKey?: string,
    useBDH?: string,
    middlewareBefore?: Function[]
    middlewareAfter?: Function[]
    customSendTransaction?:(transaction)=>Promise<any>,
    arianeeCustomConfiguration?: {
        walletReward?: {
            address: string;
        };
        brandDataHubReward?: {
            address: string;
        };
        httpProvider?: any;
        transactionOptions?: any;
        deepLink?: string;
        protocolConfiguration?: any;
        defaultArianeePrivacyGateway?:string;
    }
}) => {
  const app = express();
    process.env.apiKey = configuration.apiKey;


    const arianee = await new Arianee().init(configuration.chain, configuration.arianeeCustomConfiguration);
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
            method: createRequestFromPathAndMethod(() => wallet.address)
        },
        {
            path: '/address',
            method: createRequestFromPathAndMethod(() => wallet.address)
        },
        ...pathFinderFromWallet(wallet.methods)
    ]
        .forEach(method => {
            app.post(method.path, method.method)
        });

    // ArianeeJS V2
    [
        ...pathFinderFromWallet(wallet.arianeeMethods)
    ].forEach(method => {
        app.post(`/v2${method.path}`, method.method)
    });

    pathFinderContractFromWallet(wallet.contracts)
        .forEach(method => {
            app.post(`/contracts${method.path}`, method.method)
        });
    
    app.post('/web3/eth/getBalance', createRequestFromPathAndMethod(wallet.web3.eth.getBalance));

    app.post('/web3/eth/getBlock', createRequestFromPathAndMethod(wallet.web3.eth.getBlock));

    if (configuration.middlewareAfter) {
        app.use(configuration.middlewareAfter)
    }

    app.use((req, res, next) => {
        if (res.inError) {
            res.status(500).json(res.body);
        } else if (res.body !== undefined && res.body !== null) {
            res.status(200).json(res.body)
        } else {
            res.status(404).end();

        }
    });



    return app;
};
