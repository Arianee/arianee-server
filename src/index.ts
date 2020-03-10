import {Arianee, NETWORK} from "@arianee/arianeejs";
import {createRequestFromPathAndMethod, pathFinderFromWallet} from "./libs/arianee-path-finder";
import {AuthByApiKey} from "./middlewares/auth-middleware";
import {networkURL} from "@arianee/arianeejs/dist/src/models/networkConfiguration";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");


export const arianeeServerFactory = async (configuration: {
    privateKey?: string
    chain: NETWORK,
    apiKey?: string,
    useBDH?: string,
    middlewareBefore?: Function
    middlewareAfter?: Function
}) => {

    process.env.apiKey = configuration.apiKey;


    const arianee = await new Arianee().init(configuration.chain);
    const wallet = configuration.privateKey ?
        arianee.fromPrivateKey(configuration.privateKey)
        : arianee.fromRandomKey();

    console.log("Wallet initialized on: ", configuration.chain);
    if (configuration.useBDH) {
        wallet.useBDHVault(configuration.useBDH);
    }

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    if (configuration.middlewareBefore) {
        app.use(configuration.middlewareBefore);
    }

    if (configuration.apiKey) {
        app.use(AuthByApiKey(configuration.apiKey));
    }


    app.get('/hello', (req, res) => {
        return res.send('world');
    });

    [
        {
            path: '/requestAria',
            method: createRequestFromPathAndMethod(wallet.requestAria)
        },
        {
            path: '/requestPoa',
            method: createRequestFromPathAndMethod(wallet.requestPoa)
        },
        {
            path: '/publicKey',
            method: createRequestFromPathAndMethod(() => wallet.publicKey)
        },
        ...pathFinderFromWallet(wallet.methods)
    ]
        .forEach(method => {
            console.log('accepted methods', method.path);
            app.post(method.path, method.method)
        });

    if (configuration.middlewareAfter) {
        app.use(configuration.middlewareAfter)
    }

    console.log('public key:', wallet.publicKey);
    return app;
};
