import {arianeeServerFactory} from './index';
import {NETWORK} from "@arianee/arianeejs/dist/src";
const port = process.env.PORT || 3000;
const privateKey = process.env.privateKey;
const chain: NETWORK = process.env.chain as NETWORK || NETWORK.arianeeTestnet;
const useBDH= process.env.useBDH;

(async function(){
    const app=await arianeeServerFactory({
        privateKey,
        useBDH,
        chain
    });

    app.listen(port, () => console.log(`Arianee Server APP listening on port ${port}!`));
})();

