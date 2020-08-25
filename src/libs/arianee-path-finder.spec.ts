import {Arianee} from "@arianee/arianeejs/dist/src";
import {pathFinderFromWallet} from "./arianee-path-finder";

describe('path finder',()=>{
    test('init', async (done) => {
        expect(true).toBe(true);

        const arianee=await new Arianee().init();

        const wallet=arianee.fromRandomMnemonic();

        pathFinderFromWallet(wallet.methods)

        done();
    });

    describe('V1', () => {
        test('should iterate', () => {

            const objWithFunction = {
                function1: jest.fn(),
                function2: jest.fn()
            };
            const w = pathFinderFromWallet(objWithFunction);

            expect(w.length).toBe(2);
            expect(w[0].path).toBe('/function1');
            expect(typeof w[0].method).toBe('function')
        })

    });

    describe('V2', () => {
        test('should iterate', () => {

            const objWithFunction = {
                foo: {
                    bar:
                        {
                            baz: jest.fn()
                        }
                },
                func: jest.fn()
            };
            const w = pathFinderFromWallet(objWithFunction);

            const element = w.find(d => d.path === '/foo/bar/baz');
            expect(element).toBeDefined();
            expect(typeof element.method).toBe('function');


            const element2 = w.find(d => d.path === '/func');
            expect(element2).toBeDefined();
            expect(typeof element2.method).toBe('function');
        })
    })
})
