import {arianeeServerFactory} from '../src'
import request from 'supertest';
import {Arianee, NETWORK} from "@arianee/arianeejs/dist/src";

jest.setTimeout(20000);

describe('ArianeeJSServer', () => {
    describe('arianeeJs-server error', () => {
        let randomApp;

        beforeAll(async () => {
            const arianee = await new Arianee().init(NETWORK.testnet);
            const privateKey = arianee.fromRandomKey().privateKey;


            randomApp = await arianeeServerFactory({
                chain: NETWORK.testnet
            });

        });

        test('DEV it should return diagnosis', async (done) => {

            const result = await request(randomApp).post('/createCertificate')
                .send([{
                    content: {
                        $schema: 'https://cert.arianee.org/version1/ArianeeAsset.json',
                        name: 'Arianee'
                    }
                }]);

            expect(typeof result.body).toBe("object");
            expect(result.body[0].isTrue).toBeDefined();
            expect(result.status).toBe(500);

            expect(true).toBeTruthy();

            done();

        });

    });


});
