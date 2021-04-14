import {arianeeServerFactory} from '../src'
import request from 'supertest';
import {Arianee, NETWORK} from "@arianee/arianeejs/dist/src";

jest.setTimeout(30000);

describe('ArianeeJSServer V2', () => {

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
            const arianee = await new Arianee().init(NETWORK.testnet);
            const arianeeWallet = arianee.fromRandomKey();

            app = await arianeeServerFactory({
                arianeeWallet
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

        describe("Certificate Endpoints", () => {
            test('it should request buyCredits (certificate)', async (done) => {

                const numberOfCertificate = 3;
                try {

                    const responseBuyCredits = await request(app).post('/v2/credit/buy')
                        .send({creditType: 'certificate', quantity: numberOfCertificate});

                    expect(responseBuyCredits.status).toBe(200);

                    const res = await request(app).post('/v2/credit/balance')
                        .send({creditType: 'certificate'});

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

                    const result = await request(app).post('/v2/certificate/creation/create')
                        .send(content);

                    expect(result.body.deepLink).toBeDefined();
                    expect(result.body.certificateId).toBeDefined();
                    expect(result.body.passphrase).toBeDefined();
                    certificateId = result.body.certificateId;
                    passphrase = result.body.passphrase;

                } catch (e) {
                    console.log(e);
                    expect(false).toBeTruthy()
                }
                done()
            });
        });


    })

});
