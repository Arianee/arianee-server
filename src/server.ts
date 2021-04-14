import {arianeeServerFactory} from './index';
import {Arianee, NETWORK} from "@arianee/arianeejs/dist/src";

const port = process.env.PORT || 3000;
const privateKey = process.env.privateKey || '0x33bf56b28749d770d33cd36d1986aa5b8d4e781078e2bb501acff7409f795190';
const chain: NETWORK = process.env.chain as NETWORK || NETWORK.testnet;

(async function(){
    const arianee = await new Arianee().init(chain);
    const wallet = arianee.fromPrivateKey(privateKey);
    const app=await arianeeServerFactory({
        arianeeWallet:wallet
    });

    app.listen(port, () => console.log(`Arianee Server APP listening on port ${port}!`));
})();

