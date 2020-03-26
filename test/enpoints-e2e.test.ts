import {arianeeServerFactory} from '../src'
import request from 'supertest';
import {Arianee, NETWORK} from "@arianee/arianeejs/dist/src";

jest.setTimeout(20000);

describe('ArianeeJSServer', () => {
    describe('arianeeJs-server is set without privateKey', () => {
        let randomApp;

        beforeAll(async () => {
            const arianee = await new Arianee().init(NETWORK.arianeeTestnet);
            const privateKey = arianee.fromRandomKey().privateKey;


            randomApp = await arianeeServerFactory({
                chain: NETWORK.arianeeTestnet
            });

        });

        test('it should request approveStore', async (done) => {
            try {
                await request(randomApp).post('/approveStore')
                    .send([]);
                expect(true).toBeTruthy()
            } catch (e) {
                expect(false).toBeTruthy()
            }
            done();

        });

        test('it should request requestPOA', async (done) => {
            try {
                await request(randomApp).post('/requestPoa')
                    .send([]);

                expect(true).toBeTruthy()
            } catch (e) {
                expect(false).toBeTruthy()
            }
            done()
        });

        test('it should request requestAria', async (done) => {
            try {
                await request(randomApp).post('/requestAria')
                    .send([]);
                expect(true).toBeTruthy()
            } catch (e) {
                expect(false).toBeTruthy()
            }
            done()

        });

        test('it should request balanceOfAria', async (done) => {
            try {
                await request(randomApp).post('/balanceOfAria')
                    .send([]);

                expect(true).toBeTruthy()
            } catch (e) {
                expect(false).toBeTruthy()
            }
            done()
        });

        test('it should request chain', async (done) => {
            try {
                const result = await request(randomApp).post('/chain')
                    .send();

                expect(result.body).toEqual({
                        chainId: 1337,
                        chain: 'arianeetestnet',
                        network: 'arianeetestnet'
                    }
                );

            } catch (e) {
                expect(false).toBeTruthy()
            }
            done()
        });

    });

    describe('arianeeJs-server is set with specific privateKey', () => {
        let app, passphrase;
        let certificateId = 9510549;
        const basicCertificateContentFactory = () => ({
            uri: '',
            content: {
                $schema: 'https://cert.arianee.org/version1/ArianeeAsset.json',
                name: 'Arianee'
            }
        });

        const basicEventContentFactory = (certId = certificateId) => ({
            $schema: 'https://cert.arianee.org/version1/ArianeeEvent-i18n.json',
            title: 'zeokzef'
        });
        beforeAll(async () => {
            const arianee = await new Arianee().init(NETWORK.arianeeTestnet);
            const privateKey = arianee.fromRandomKey().privateKey;

            app = await arianeeServerFactory({
                chain: NETWORK.arianeeTestnet,
                privateKey: privateKey
            });

            await request(app).post('/requestPoa')
                .send();

            await request(app).post('/requestAria')
                .send();

            const responseapproveStore = await request(app).post('/approveStore')
                .send();
        });

        describe("Certificate Endpoints", () => {
            test('it should request buyCredits (certificate)', async (done) => {

                const numberOfCertificate = 3;
                try {

                    const responseBuyCredits = await request(app).post('/buyCredits')
                        .send(["certificate", numberOfCertificate]);

                    expect(responseBuyCredits.status).toBe(200);

                    const res = await request(app).post('/balanceOfCredit')
                        .send(["certificate"]);

                    expect(res.body.toString()).toBe(numberOfCertificate.toString());

                    expect(true).toBeTruthy()
                } catch (e) {
                    expect(false).toBeTruthy()
                }
                done()

            });
            test('it should create certificate', async (done) => {
                try {
                    const content = basicCertificateContentFactory();

                    const result = await request(app).post('/createCertificate')
                        .send([content]);

                    expect(result.body.deepLink).toBeDefined();
                    expect(result.body.certificateId).toBeDefined();
                    expect(result.body.passphrase).toBeDefined();
                    certificateId = result.body.certificateId;
                    passphrase = result.body.passphrase;

                } catch (e) {
                    expect(false).toBeTruthy()
                }
                done()
            });

            test('it should request storeContentInRPCServer', async (done) => {

                try {
                    const result = await request(app).post('/storeContentInRPCServer')
                        .send([certificateId, basicCertificateContentFactory().content, "https://arianee.cleverapps.io/arianeetestnet/rpc"]);

                    expect(result.status).toBe(200);
                    expect(true).toBeTruthy()
                } catch (e) {
                    console.error(e);
                    expect(false).toBeTruthy()
                }
                done()
            });


            test('it should request createAndStoreCertificate', async (done) => {
                try {
                    const content = basicCertificateContentFactory();

                    const result = await request(app).post('/createAndStoreCertificate')
                        .send([content,"https://arianee.cleverapps.io/arianeetestnet/rpc"]);

                    expect(result.body.deepLink).toBeDefined();
                    expect(result.body.certificateId).toBeDefined();
                    expect(result.body.passphrase).toBeDefined();
                    certificateId = result.body.certificateId;
                    passphrase = result.body.passphrase;

                } catch (e) {
                    expect(false).toBeTruthy()
                }
                done()
            });

            test('it should request getCertificate with query', async (done) => {
                try {
                    expect(certificateId).toBeDefined();
                    expect(passphrase).toBeDefined();

                    const result = await request(app).post('/getCertificate')
                        .send([certificateId, passphrase, {issuer: true, content: true}]);

                    expect(result.body).toBeDefined();
                    expect(true).toBeTruthy()
                } catch (e) {
                    expect(false).toBeTruthy()
                }
                done()
            });
        });

        describe('Event Endpoints', () => {
            let arianeeEventId;
            test('it should request buyCredits (event)', async (done) => {
                const numberOfCertificate = 3;

                try {

                    const responseBuyCredits = await request(app).post('/buyCredits')
                        .send(["event", numberOfCertificate]);

                    expect(responseBuyCredits.status).toBe(200);

                    const res = await request(app).post('/balanceOfCredit')
                        .send(["event"]);

                    expect(res.body.toString()).toBe(numberOfCertificate.toString());


                    expect(true).toBeTruthy()
                } catch (e) {
                    expect(false).toBeTruthy()
                }
                done()
            });
            test('it should request createArianeeEvent', async (done) => {
                try {
                    const result = await request(app).post('/createArianeeEvent')
                        .send([
                            {
                                "certificateId": certificateId,
                                "content": basicEventContentFactory()
                            }
                        ]);

                    expect(result.body.arianeeEventId).toBeDefined();

                    arianeeEventId = result.body.arianeeEventId;
                    expect(true).toBeTruthy()
                } catch (e) {
                    console.error(e);
                    expect(false).toBeTruthy()
                }
                done()
            });
            test('it should request storeArianeeEvent', async (done) => {

                try {
                    const result = await request(app).post('/storeArianeeEvent')
                        .send([

                            certificateId,
                            arianeeEventId,
                            basicEventContentFactory(),
                            "https://arianee.cleverapps.io/arianeetestnet/rpc"

                        ]);

                    expect(result.status).toBe(200);
                } catch (e) {
                    console.error(e);
                    expect(false).toBeTruthy()
                }
                done()
            });

            test('it should request createAndStoreArianeeEvent', async (done) => {
                try {
                    const result = await request(app).post('/createAndStoreArianeeEvent')
                        .send([
                            {
                                "certificateId": certificateId,
                                "content": basicEventContentFactory()
                            },
                            "https://arianee.cleverapps.io/arianeetestnet/rpc"
                        ]);

                    expect(result.body.arianeeEventId).toBeDefined();

                    arianeeEventId = result.body.arianeeEventId;
                    expect(true).toBeTruthy()
                } catch (e) {
                    console.error(e);
                    expect(false).toBeTruthy()
                }
                done()
            });
            test('it should  acceptArianeeEvent', async (done) => {
                try {
                    const result = await request(app).post('/acceptArianeeEvent')
                        .send([arianeeEventId]);

                    expect(true).toBeTruthy()
                } catch (e) {
                    console.error(e);
                    expect(false).toBeTruthy()
                }
                done()
            });

            test('it should request createArianeeEvent and refuse', async (done) => {
                try {
                    const {arianeeEventId} = await request(app).post('/createArianeeEvent')
                        .send([{
                            certificateId: certificateId,
                            content: {
                                $schema: 'https://cert.arianee.org/version1/ArianeeEvent-i18n.json',
                                title: 'zeokzef'
                            }
                        }]);

                    const result = await request(app).post('/refuseArianeeEvent')
                        .send([arianeeEventId]);

                    expect(true).toBeTruthy()
                } catch (e) {
                    console.error(e);
                    expect(false).toBeTruthy()
                }
                done()
            });


        });
        describe('Others', () => {

            test('it should request buyCredits (message)', async (done) => {
                const numberOfCertificate = 3;

                try {

                    const responseBuyCredits = await request(app).post('/buyCredits')
                        .send(["message", numberOfCertificate]);

                    expect(responseBuyCredits.status).toBe(200);

                    const res = await request(app).post('/balanceOfCredit')
                        .send(["message"]);

                    expect(res.body.toString()).toBe(numberOfCertificate.toString());


                    expect(true).toBeTruthy()
                } catch (e) {
                    expect(false).toBeTruthy()
                }
                done()
            });

        })

    })

});
