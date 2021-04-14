import {
  createRequestFromPathAndMethod,
  pathFinderContractFromWallet,
  pathFinderFromWallet
} from "./libs/arianee-path-finder";
import {ArianeeWallet} from "@arianee/arianeejs/dist/src/core/wallet";

const express = require("express");

const bodyParser = require("body-parser");
const cors = require('cors')

export const arianeeServerFactory = async (configuration: {
    middlewareBefore?: Function[]
    middlewareAfter?: Function[]
    customSendTransaction?:(transaction)=>Promise<any>,
    arianeeWallet:ArianeeWallet
}) => {
  const app = express();

    let wallet = configuration.arianeeWallet

    console.log("Wallet initialized on: ", wallet.configuration.networkName);
    console.log('public key:', wallet.address);


    if (configuration.customSendTransaction) {
        wallet.setCustomSendTransaction(configuration.customSendTransaction);
    }
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    if (configuration.middlewareBefore) {
        app.use(configuration.middlewareBefore);
    }


    app.get('/hello', (req, res) => {
        return res.send('world');
    });

    app.post('/chain', (req, res) => {
        return res.json({
            chainId:wallet.configuration.chainId,
            chain:wallet.configuration.networkName,
            network:wallet.configuration.networkName
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
