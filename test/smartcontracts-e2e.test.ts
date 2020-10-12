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

        describe("Smartassets Endpoints", () => {
            test('it should be able to do a call without parameters', async (done) => {
                try {
                    const response = await request(app).post('/contracts/storeContract/ariaUSDExchange/call')
                        .send();

                    expect(response.status).toBe(200);

                    expect(true).toBeTruthy()
                } catch (e) {
                    console.log(e);
                    expect(false).toBeTruthy()
                }
                done()

            });

            test('it should be able to do a call with parameters empty array', async (done) => {

                try {
                    const response = await request(app).post('/contracts/storeContract/ariaUSDExchange/call')
                        .send([]);

                    expect(response.status).toBe(200);

                    expect(true).toBeTruthy()
                } catch (e) {
                    console.log(e);
                    expect(false).toBeTruthy()
                }
                done()

            });

            test('it should be able to do a call with parameter undefined', async (done) => {

                try {
                    const response = await request(app).post('/contracts/storeContract/ariaUSDExchange/call')
                        .send(undefined);

                    expect(response.status).toBe(200);

                    expect(true).toBeTruthy()
                } catch (e) {
                    console.log(e);
                    expect(false).toBeTruthy()
                }
                done()

            });
            test('it should be able to do a call', async (done) => {

                try {

                    const response = await request(app).post('/contracts/smartAssetContract/ownerOf/call')
                        .send([1]);

                    expect(response.status).toBe(200);

                    expect(response.body).toBe("0x476dcc415691bb82FF3eeB7C1f553249509027F9");

                    expect(true).toBeTruthy()
                } catch (e) {
                    console.log(e);
                    expect(false).toBeTruthy()
                }
                done()

            });

            test('it should be able to do a call with multiple argument', async (done) => {
                const responseBuyCredit = await request(app).post('/contracts/storeContract/buyCredit/send')
                    .send([0, 3, wallet.address]);


                expect(responseBuyCredit.status).toBe(200);


                const responseBalance = await request(app).post('/contracts/creditHistoryContract/balanceOf/call')
                    .send([wallet.address, 0]);

                expect(responseBalance.body).toBe("3");

                done()
            });

            test('it should be able to call getPastEvent', async (done) => {
                const response = await request(app).post('/contracts/smartAssetContract/getPastEvents')
                    .send([
                        'Hydrated',
                        {fromBlock: 17210000, toBlock: 17210500}
                    ]);

                expect(response.status).toBe(200);
                expect(response.body.length).toBe(4);

                done()

            });
        });
    })
});
