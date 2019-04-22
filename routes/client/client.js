let grpc = require("grpc/index");

var protoLoader = require("@grpc/proto-loader/build/src/index");
var readline = require("readline");

//Read terminal Lines
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Load the protobuf
var proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("proto/Comms.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

const REMOTE_SERVER = "127.0.0.1:6565";

let name;
let call;
//Create gRPC client
let client = new proto.com.cit.micro.grpc.client.Chat(
    REMOTE_SERVER,
    grpc.credentials.createSsl()
);

//Start the stream between server and client
function startChat() {
    console.log("Name: ", name);
    call = client.send({ name: name, text: "hi" });
    call.on('data', onData);
    call.on('error', onError);
    rl.on("line", function(text) {
        if (text.toUpperCase() == "EXIT")
            call.end();
        else
            call.write({ name: name, text: text });
    });
}

//When server send a message
function onData(message) {

    if (message.name === name) {
        return;
    }
    console.log(`${message.name}: ${message.text}`);
}

function onError(message){
    console.log(message)
}

//Ask user name then start the chat
rl.question("What's ur name? ", answer => {
    name = answer;
    startChat();
});