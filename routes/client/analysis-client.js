let grpc = require("grpc/index");
let protoLoader = require("@grpc/proto-loader/build/src/index");
let logger = require('./log-client');
let express = require("express");
// todo dynamically find this
const REMOTE_SERVER = "127.0.0.1:6567";
const ANALYSIS_PROTO = __dirname + "/../../protos/analysis.proto";

//Load the protobuf
let analysisProto = grpc.loadPackageDefinition(
    protoLoader.loadSync(ANALYSIS_PROTO, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

let resultData = [];

let client = new analysisProto.com.cit.micro.analysis.Analyze(
    REMOTE_SERVER,
    grpc.credentials.createInsecure(),
    logger.info('Creating connection to Analysis service')
);

exports.getUidLogsCall = function(req, res){
    resultData.length = 0;
    let id = req.body.uid;
    console.log(id);
    let call = client.getSystemLogs({uid:id});
    call.on('data', onData);
    call.on('error', onError);
    call.read();
    call.on('end', function () {
        res.status(200);
        res.write(JSON.stringify(resultData));
        res.end();
    });
};

exports.getAllCall = function (id, req, res) {
    resultData.length = 0;
    let call = client.getAll({Id: id});
    call.on('data', onData);
    call.on('error', onError);
    call.read();
    call.on('end', function () {
        res.status(200);
        res.write(JSON.stringify(resultData));
        res.end();
    });
};

exports.deleteCall = function (req, res) {
    console.log(req.body);
    client.delete(req.body, function (err, response) {
        if (err) {
            console.log(err);
            res.status(err.toString());
        } else {
            logger.info('Success from delete:');
            res.status(200);
            res.send("OK");
        }
    });
};

//When server send a message
function onData(message) {
    //console.log(`${message.id}:: ${message.uid}: ${message.text}`);
    let found = false;
    for(var i = 0; i < resultData.length; i++) {
        if (resultData[i].id === message.id) {
            found = true;
            break;
        }
    }
    if (!found){
        resultData.push(message)
    }

}

function onError(message) {
    console.log(message)
}