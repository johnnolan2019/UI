let grpc = require("grpc/index");
let protoLoader = require("@grpc/proto-loader/build/src/index");
let express = require("express");
let  app = express();
// todo dynamically find this
const REMOTE_SERVER = "127.0.0.1:6565";
const LOG_PROTO = __dirname + "/../../protos/logger.proto";
const SERVICE_NAME = "UI";


//Load the protobuf
let analysisProto = grpc.loadPackageDefinition(
    protoLoader.loadSync(LOG_PROTO, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

let client = new analysisProto.com.cit.micro.logger.Logger(
    REMOTE_SERVER,
    // todo set secure server
    grpc.credentials.createInsecure()
);

exports.info = function (message) {
    console.log(message);
    client.info({timeStamp: Date.getTime, serviceName: SERVICE_NAME, message: message}, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response.result);
        }
    });
};

exports.error = function (message) {
    client.error({timeStamp: Date.getTime, serviceName: SERVICE_NAME, message: message}, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response.result);
        }
    });
};

exports.debug = function (message) {
    client.debug({timeStamp: Date.getTime, serviceName: SERVICE_NAME, message: message}, function (err, response) {
        if (err) {
            console.log(err);

        } else {
            console.log(response.result);
        }
    });
};
