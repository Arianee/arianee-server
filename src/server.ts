import {arianeeServerFactory} from './index';
import {NETWORK} from "@arianee/arianeejs/dist/src";
const port = process.env.PORT || 3000;
const privateKey = process.env.privateKey || '0xff7cdcab8d92c87fa8e5fe6af70fcefc5b1df398bcc7ca3d16981f535a9d8d85';
const chain: NETWORK = process.env.chain as NETWORK || NETWORK.arianeeTestnet;
const useBDH= process.env.useBDH;
const apiKey=process.env.apiKey;

(async function(){
    const app=await arianeeServerFactory({
        privateKey,
        apiKey,
        useBDH,
        chain
    });

    app.listen(port, () => console.log(`Arianee Server APP listening on port ${port}!`));
})();

