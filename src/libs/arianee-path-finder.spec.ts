import {Arianee} from "@arianee/arianeejs/dist/src";
import {pathFinderFromWallet} from "./arianee-path-finder";

describe('path finder',()=>{
    test('',async (done)=>{
        expect(true).toBe(true);

        const arianee=await new Arianee().init();

        const wallet=arianee.fromRandomMnemonic();

        pathFinderFromWallet(wallet.methods)

        done();
    })
})
