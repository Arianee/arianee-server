import axios from "axios";

const localhostURL=`http://localhost:${process.env.PORT}`;

const defaultConfig={
    headers:{
        'authorization':`Basic ${process.env.apiKey}`
    }
}

describe('ArianeeJSServer',()=>{
    let certificateId, passphrase,arianeeEventId, arianeeEventContent,certificateContent;

    test('it should request approveStore',async (done)=>{
        let certificateID, passphrase;
        try{
        await axios.post(`${localhostURL}/approveStore`,[],defaultConfig);
            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()

    })

    test('it should request requestPOA',async (done)=>{
        try{
            await axios.post(`${localhostURL}/requestPoa`,[],defaultConfig);
            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()
    })

    test('it should request requestAria',async (done)=>{
        try{
            await axios.post(`${localhostURL}/requestAria`,[],defaultConfig);
            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()

    })

    test('it should request balanceOfAria',async (done)=>{
        try{
            await axios.post(`${localhostURL}/balanceOfAria`,[],defaultConfig);
            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()
    })
    test('it should request balanceOfPoa',async (done)=>{
        try{
            await axios.post(`${localhostURL}/balanceOfPoa`,[],defaultConfig);
            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()
    })

    test('it should request buyCredits (certificate)',async (done)=>{
        try{
            await axios.post(`${localhostURL}/buyCredits`,["certificate",1],defaultConfig);

            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()

    })
    test('it should request buyCredits (event)',async (done)=>{
        try{
            await axios.post(`${localhostURL}/buyCredits`,["event",1],defaultConfig);

            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()
    })
    test('it should request buyCredits (message)',async (done)=>{
        try{
            await axios.post(`${localhostURL}/buyCredits`,["message",1],defaultConfig);

            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()
    })
    test('it should request getIdentity',async (done)=>{
        try{
            await axios.post(`${localhostURL}/buyCredits`,["message",1],defaultConfig);

            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()
    })
    test('it should create certificate',async (done)=>{
        try{
            const content={
                uri: 'http://localhost:3000/mycertificate.json',
                content: {
                    $schema: 'https://cert.arianee.org/version1/ArianeeAsset.json',
                    name: 'Arianee',
                    v: '0.1',
                    serialnumber: [{ type: 'serialnumber', value: 'SAMPLE' }],
                    brand: 'Arianee',
                    model: 'Token goody',
                    description:
                        'Here is the digital passport of your Arianee token goody, giving you a glimpse of an augmented ownership experience. This Smart-Asset has a unique ID. It is transferable and enables future groundbreaking features. \n Connect with the arianee team to learn more.',
                    type: 'SmartAsset',
                    picture:
                        'https://www.arianee.org/wp-content/uploads/2019/02/Screen-Shot-2019-02-27-at-12.12.53-PM.png',
                    pictures: [
                        {
                            src:
                                'https://www.arianee.org/wp-content/uploads/2019/02/Screen-Shot-2019-02-27-at-12.14.36-PM.png'
                        }
                    ],
                    socialmedia: { instagram: 'arianee_project', twitter: 'ArianeeProject' },
                    externalContents: [
                        {
                            title: 'About Arianee',
                            url: 'https://www.arianee.org',
                            backgroundColor: '#000',
                            color: '#FFF'
                        }
                    ],
                    jsonSurcharger: 'url'
                }
            };

            certificateContent=content.content;
            const result =await axios.post(`${localhostURL}/createCertificate`,[content],defaultConfig);

            certificateId=result.data.certificateId;
            passphrase=result.data.passphrase;

            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()
    })

    test('it should request getCertificate with query issuer',async (done)=>{
        try{
           const cert= await axios.post(`${localhostURL}/getCertificate`,[1,'cert1passphrase',{issuer:true}],defaultConfig);
            expect(cert.data.issuer).toBeDefined();
            expect(cert.data.content).toBeUndefined();

            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()
    })

    test('it should request getCertificate with query issuer',async (done)=>{
        try{
            const cert= await axios.post(`${localhostURL}/getCertificate`,[1,'cert1passphrase',{content:true}],defaultConfig);

            expect(cert.data.content).toBeDefined();
            expect(true).toBeTruthy()
        }catch(e){
            expect(false).toBeTruthy()
        }
        done()
    })

    test('it should request createArianeeEvent',async (done)=>{
        try{
            const cert= await axios.post(`${localhostURL}/createArianeeEvent`,[{
                certificateId:certificateId,
                content:{
                    $schema:'https://cert.arianee.org/version1/ArianeeEvent-i18n.json',
                    title:'zeokzef'
                }
            }],defaultConfig);
            arianeeEventId=cert.data.arianeeEventId;
            expect(true).toBeTruthy()
        }catch(e){
            console.log(e)
            expect(false).toBeTruthy()
        }
        done()
    })

    test('it should  acceptArianeeEvent',async (done)=>{
        try{
            const cert= await axios.post(`${localhostURL}/acceptArianeeEvent`,[arianeeEventId],defaultConfig);
            expect(true).toBeTruthy()
        }catch(e){
            console.log(e)
            expect(false).toBeTruthy()
        }
        done()
    })

    test('it should request createArianeeEvent and refuse',async (done)=>{
        try{
            arianeeEventContent={
                $schema:'https://cert.arianee.org/version1/ArianeeEvent-i18n.json',
                title:'zeokzef'
            };

            const cert= await axios.post(`${localhostURL}/createArianeeEvent`,[{
                certificateId:certificateId,
                content:arianeeEventContent
            }],defaultConfig);
            const arianeeEventId=cert.data.arianeeEventId;
            await axios.post(`${localhostURL}/refuseArianeeEvent`,[arianeeEventId],defaultConfig);
            expect(true).toBeTruthy()
        }catch(e){
            console.log(e)
            expect(false).toBeTruthy()
        }
        done()
    })
    test('it should request storeArianeeEvent',async (done)=>{

        try{
            const cert= await axios.post(`${localhostURL}/storeArianeeEvent`,[
                certificateId,arianeeEventId,arianeeEventContent,"https://arianee.cleverapps.io/arianeetestnet/rpc"
            ],defaultConfig);
            expect(true).toBeTruthy()
        }catch(e){
            console.log(e)
            expect(false).toBeTruthy()
        }
        done()
    })
    test('it should request storeContentInRPCServer',async (done)=>{

        try{
            const cert= await axios.post(`${localhostURL}/storeContentInRPCServer`,[
                certificateId,certificateContent,"https://arianee.cleverapps.io/arianeetestnet/rpc"
            ],defaultConfig);
            expect(true).toBeTruthy()
        }catch(e){
            console.log(e)
            expect(false).toBeTruthy()
        }
        done()
    })
    test('it should be 401 if apikey is wrong',async (done)=>{
        try{
            const cert= await axios.post(`${localhostURL}/approveStore`,undefined,{
                headers:{
                    'authorization':`Basic wrongprivatekey`
                }
            });
            expect(false).toBeTruthy()
        }catch(e){
            console.log(e.response.status)
            expect(e.response.status).toBe(401)
            expect(true).toBeTruthy()
        }
        done()
    })
})
