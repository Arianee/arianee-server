const {spawn}=require("child_process");

let serverProcess;
jest.setTimeout(20000);

process.env.apiKey='myApiKey'
process.env.PORT='3001';

const env={
    ...process.env
};

console.log(env.apiKey)
beforeAll(async (done) => {
   console.log("server launching")

    const server = new Promise(resolve => {
            serverProcess = spawn("node",['./dist/index.js'],{env:env});
            return serverProcess.stdout.on('data',resolve);
    });

    console.log("server launched")
    await server;
    done();
});

afterAll(()=>{
       // serverProcess.kill();
})

