var express = require('express');
var router = express.Router();
var reputationController = require('../controllers/reputationController');

// Route to issue VC
router.get('/issue', async function(req, res, next) {
    try {
        let userId = req.query.userId;
        let reputationData = await reputationController.fetchStackOverflowReputation(userId);
        let vc = await reputationController.issueVerifiedCredential(reputationData);
        res.send(vc);
    } catch (error) {
        res.status(500).send('Error issuing VC');
    }
});

// New route to just fetch and return reputation value
router.get('/value', async function(req, res, next) {
    try {
        let userId = req.query.userId;
        let reputationValue = await reputationController.fetchStackOverflowReputation(userId);
        res.json({ reputation: reputationValue });
    } catch (error) {
        res.status(500).send('Error fetching reputation');
    }
});

module.exports = router;