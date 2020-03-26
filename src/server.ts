import {arianeeServerFactory} from './index';
import {NETWORK} from "@arianee/arianeejs/dist/src";
const port = process.env.PORT || 3000;
const privateKey = process.env.privateKey || '0x33bf56b28749d770d33cd36d1986aa5b8d4e781078e2bb501acff7409f795190';
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

