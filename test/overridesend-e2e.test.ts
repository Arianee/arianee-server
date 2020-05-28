import {arianeeServerFactory} from '../src'
import request from 'supertest';
import {Arianee, NETWORK} from "@arianee/arianeejs/dist/src";

jest.setTimeout(20000);

describe('ArianeeJSServer overridesend', () => {

    let customSend;
    describe('arianeeJs-server is set with specific privateKey', () => {
        let app;
        const basicCertificateContentFactory = () => ({
            uri: '',
            content: {
                $schema: 'https://cert.arianee.org/version1/ArianeeAsset.json',
                name: 'Arianee'
            }
        });

        beforeAll(async () => {
            const arianee = await new Arianee().init(NETWORK.arianeeTestnet);
            const privateKey = arianee.fromRandomKey().privateKey;

            customSend = jest.fn().mockImplementation((transaction) => {
                return Promise.resolve()
            });

            app = await arianeeServerFactory({
                chain: NETWORK.arianeeTestnet,
                privateKey: privateKey,
                customSendTransaction: customSend
            });

        });

        beforeEach(() => {
            jest.clearAllMocks()
        });

        describe("Certificate Endpoints", () => {
            test('it should request buyCredits (certificate)', async (done) => {

                const numberOfCertificate = 3;

                const result = await request(app).post('/buyCredits')
                    .send(["certificate", numberOfCertificate]);

                expect(result.status).toBe(200);

                // Should have transaction in return
                console.log(result.body.from);
                expect(result.body.from).toBeDefined();
                expect(result.body.data).toBeDefined();
                expect(result.body.gas).toBeDefined();
                expect(result.body.gasPrice).toBeDefined();
                expect(customSend).toHaveBeenCalledTimes(1);
                expect(true).toBeTruthy();
                done()

            });
            test('it should create certificate', async (done) => {
                const content = basicCertificateContentFactory();

                const result = await request(app).post('/createCertificate')
                    .send([content]);

                expect(result.body.deepLink).toBeDefined();
                expect(result.body.certificateId).toBeDefined();
                expect(result.body.passphrase).toBeDefined();
                expect(customSend).toHaveBeenCalledTimes(1);

                // Should have transaction in return
                expect(result.body.from).toBeDefined();
                expect(result.body.data).toBeDefined();
                expect(result.body.gas).toBeDefined();
                expect(result.body.gasPrice).toBeDefined();

                done()
            });
        });

    })

});
