import { arianeeServerFactory } from '../src'
import request from 'supertest';
import { Arianee, NETWORK } from "@arianee/arianeejs/dist/src";

jest.setTimeout(20000);

describe('ArianeeJSServer arianeeCustomConfiguration', () => {

    test('it should use custom gasprice', async (done) => {

        const customConfig = { transactionOptions:{gas: 20000000, gasPrice: 10000000000 }};
        const arianee = await new Arianee().init(NETWORK.testnet, customConfig);
        const arianeeWallet = arianee.fromRandomKey();

        const customSend = jest.fn().mockImplementation((transaction) => {
            return Promise.resolve()
        });


        const app = await arianeeServerFactory({
            arianeeWallet,
            customSendTransaction: customSend
        });
        const numberOfCertificate = 3;

        const result = await request(app).post('/buyCredits')
            .send(["certificate", numberOfCertificate]);

        expect(result.status).toBe(200);

        // Should have transaction in return
        console.log(result.body.from);
        expect(result.body.from).toBeDefined();
        expect(result.body.data).toBeDefined();
        expect(result.body.gas).toBeDefined();
        expect(result.body.gasPrice).toBe(customConfig.transactionOptions.gasPrice);
        expect(result.body.gas).toBe(customConfig.transactionOptions.gas);

        expect(customSend).toHaveBeenCalledTimes(1);
        expect(true).toBeTruthy();
        done()

    });

});


