const {spawn}=require("child_process");

let serverProcess;
jest.setTimeout(20000);

process.env.apiKey='myApiKey'
process.env.PORT='3000';

const env={
    ...process.env
};

beforeAll(async (done) => {
   console.log("server launching")

    const server = new Promise(resolve => {
            serverProcess = spawn("node",['./dist/server.js'],{env:env});
            return serverProcess.stdout.on('data',resolve);
    });

    console.log("server launched")
    await server;
    setTimeout(()=>{
        done();
    },2500)
});

afterAll(()=>{
       serverProcess.kill();
})

