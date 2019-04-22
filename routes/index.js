const express = require('express');
const router = express.Router();
const path = require('path');
const analysisClient = require('./client/analysis-client');
const managerClient = require('./client/manager-client');
const appLog = require('./client/log-client');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/home.html'));
});

router.get("/getAll", function(req, res, next) {
    appLog.info("attempting to get all values from server");
    analysisClient.getAllCall(12, req, res);
    res.status(200);
});

router.get("/getUid", function(req, res, next) {
    appLog.info("attempting to get UID values from server");
    managerClient.getUid(12, req, res);
    res.status(200);
});

router.post("/subscribe", function(req, res, next) {
    appLog.info("attempting to add new subscription to db");
    managerClient.subscribeNew(req, res);
    res.status(200);
});

module.exports = router;