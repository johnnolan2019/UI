let grpc = require("grpc/index");
let protoLoader = require("@grpc/proto-loader/build/src/index");
let logger = require('./log-client');
let express = require("express");
// todo dynamically find this
const REMOTE_SERVER = "manager-service:6569";
const MANAGER_PROTO = __dirname + "/../../protos/manager.proto";

//Load the protobuf
let managerProto = grpc.loadPackageDefinition(
    protoLoader.loadSync(MANAGER_PROTO, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

let client = new managerProto.com.cit.micro.manager.AccessManager(
    REMOTE_SERVER,
    grpc.credentials.createInsecure(),
    logger.info('Creating connection to Manager service')
);

let resultData = [];

exports.getUid = function (id, req, res) {
    let call = client.getUid({Id: id});
    call.on('data', onData);
    call.on('error', function (err) {
        res.status(500);
        res.send(err.toString())
    });
    call.read();
    call.on('end', function () {
        res.status(200);
        res.write(JSON.stringify(resultData));
        res.end();
        //call.close();
    });
};

exports.subscribeNew = function (req, res) {
    console.log(req.body.uid);
    console.log(req.body.channel);
    let uid = req.body.uid;
    let channel = req.body.channel;
    client.subscribeNew({channel:channel, uid: uid}, function(err, response){
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err.toString());
        } else {
            console.log(response.text);
            console.log("This worked??");
            res.status(200);
            res.end();
        }
    });
};

function onData(message) {
    let found = false;
    for(let i = 0; i < resultData.length; i++) {
        if (resultData[i].uid === message.uid) {
            found = true;
            break;
        }
    }
    if (!found){
        resultData.push(message)
    }
}