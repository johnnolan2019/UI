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

let client = new analysisProto.com.cit.micro.note.Notation(
    REMOTE_SERVER,
    grpc.credentials.createInsecure(),
    logger.info('Creating connection to Note service')
);

exports.add = function (note, req, res) {
    console.log("in here");
    let call = client.add({Note: note});
    call.on('data', onData);
    call.on('error', onError);
    call.write(note);
};

//When server send a message
function onData(message) {
    console.log(`${message.uid}: ${message.text}`);
}

function onError(message) {
    console.log(message)
}