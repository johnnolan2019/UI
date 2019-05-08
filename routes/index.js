const express = require('express');
const router = express.Router();
const path = require('path');
const analysisClient = require('./client/analysis-client');
const managerClient = require('./client/manager-client');
const appLog = require('./client/log-client');
const noteClient = require('./client/note-client');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/home.html'));
});

router.get("/getAll", function(req, res, next) {
    appLog.info("attempting to get all values from server");
    analysisClient.getAllCall(12, req, res);
});

router.post("/getUidLogs", function(req, res, next) {
    appLog.info("attempting to get all values from server for single UID");
    analysisClient.getUidLogsCall(req, res);
});

router.get("/getUid", function(req, res, next) {
    appLog.info("attempting to get UID values from server");
    managerClient.getUid(12, req, res);
});

router.post("/subscribe", function(req, res, next) {
    appLog.info("attempting to add new subscription to db");
    managerClient.subscribeNew(req, res);
});

router.post("/addNote", function(req, res, next) {
    appLog.info("attempting to a new note");
    noteClient.add(req, res);
});

router.post("/getNote", function (req, res, next) {
    appLog.info("attempting to a get a note");
    noteClient.get(req, res);
});

router.delete("/removeLog", function (req, res) {
    analysisClient.deleteCall(req, res)
});

module.exports = router;