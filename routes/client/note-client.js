let grpc = require("grpc/index");
let protoLoader = require("@grpc/proto-loader/build/src/index");
let logger = require('./log-client');
let express = require("express");
// todo dynamically find this
const REMOTE_SERVER = "127.0.0.1:6566";
const NOTE_PROTO = __dirname + "/../../protos/note.proto";


//Load the protobuf
let analysisProto = grpc.loadPackageDefinition(
    protoLoader.loadSync(NOTE_PROTO, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

let resultData = [];

let client = new analysisProto.com.cit.micro.note.Notation(
    REMOTE_SERVER,
    grpc.credentials.createInsecure(),
    logger.info('Creating connection to Note service')
);

exports.add = function (req, res) {
    console.log(req.body.id);
    console.log(req.body.note);
    let id = req.body.id;
    let note = req.body.note;
    client.add({pointer:parseInt(id), text: note}, function(err, response){
        if (err) {
            console.log(err);
        } else {
            console.log(response.text);
            console.log("This worked??");
            res.status(200);
            res.end();
        }
    });
};

exports.get = function (req, res) {
    let id = req.body.id;
    console.log(id);
    resultData.length = 0;
    let call = client.get({id: id});
    call.on('data', onData);
    call.on('error', onError);
    call.read();
    call.on('end', function () {
        res.status(200);
        res.write(JSON.stringify(resultData));
        res.end();
        //call.close();
    });
};

//When server send a message
function onData(message) {
    console.log(`${message.pointer}: ${message.text}`);
    resultData.push(message.text);
}

function onError(message) {
    console.log(message)
}