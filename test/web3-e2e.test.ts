import {arianeeServerFactory} from '../src'
import request from 'supertest';
import {Arianee, NETWORK} from "@arianee/arianeejs/dist/src";
import {ArianeeWallet} from "@arianee/arianeejs/dist/src/core/wallet";

jest.setTimeout(20000);

describe('Smartcontracts', () => {

    describe('arianeeJs-server is set with specific privateKey', () => {
        let app;

        let wallet: ArianeeWallet;

        beforeAll(async () => {
            const arianee = await new Arianee().init(NETWORK.testnet);
            wallet = arianee.fromRandomKey();
            const privateKey = wallet.privateKey;

            app = await arianeeServerFactory({
                chain: NETWORK.testnet,
                privateKey: privateKey
            });

            request(app).post('/v2/poa/faucet')
                .send();

            await Promise.all([
                request(app).post('/v2/aria/faucet')
                    .send(),
                request(app).post('/v2/store/approve')
                    .send()
            ])

        });

        describe("getBlock", () => {
              test('it should be able to return a block', async (done) => {

                try {
                    const response = await request(app).post('/web3/eth/getBlock')
                        .send([122]);

                    expect(response.status).toBe(200);
                    expect(response.body.number).toBe(122);

                    expect(true).toBeTruthy()
                } catch (e) {
                    console.log(e);
                    expect(false).toBeTruthy()
                }
                done()

            });

        })
    })
});
