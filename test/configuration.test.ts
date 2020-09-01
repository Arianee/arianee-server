import {arianeeServerFactory} from '../src'
import request from 'supertest';
import {Arianee, NETWORK} from "@arianee/arianeejs/dist/src";

jest.setTimeout(20000);

describe('Configuration and different behaviors', () => {

    describe('arianeeJs-server is set without privateKey', () => {
        let randomApp;

        beforeAll(async () => {
            const arianee = await new Arianee().init(NETWORK.testnet);
            const privateKey = arianee.fromRandomKey().privateKey;


            randomApp = await arianeeServerFactory({
                chain: NETWORK.testnet
            });
        });

        test('it should not expose privateKey (GET)', async (done) => {
            try {
                const response =await request(randomApp)
                    .get('/privateKey')
                    .send();

                expect(response.status).toBe(404);
            } catch (e) {
                expect(false).toBeTruthy()
            }
            done()
        });

        test('it should not expose privateKey (POST)', async (done) => {
            try {
                const response =await request(randomApp)
                    .post('/privateKey')
                    .send();

                expect(response.status).toBe(404);
            } catch (e) {
                expect(false).toBeTruthy()
            }
            done()
        });

        test('it should change privateKey for eachRequest', async (done) => {
            try {
                const firstRequest = request(randomApp)
                    .post('/publicKey')
                    .send();

                const secondRequest = request(randomApp)
                    .post('/publicKey')
                    .send();

                const [pubKey1, pubKey2] = await Promise.all([firstRequest, secondRequest]);

                expect(pubKey1.body !== pubKey2.body).toBeTruthy();

            } catch (e) {
                expect(false).toBeTruthy()
            }
            done()
        });
    });

});
