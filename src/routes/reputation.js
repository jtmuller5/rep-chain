var express = require('express');
var router = express.Router();
var reputationController = require('../controllers/reputationController');

// Route to issue VC
router.get('/issue', async function(req, res, next) {

    let platform = req.query.platform;
    let userId = req.query.userId;
    let email = req.query.email;

    switch(platform) {
        case 'stackoverflow':
            try {
                let reputation = await reputationController.fetchStackOverflowReputation(userId);
                let vc = await reputationController.issueVerifiedCredential(userId, reputation, email, "Stack Overflow", "Reputation");
                res.send(vc);
            } catch (error) {
                res.status(500).send('Error issuing VC');
            }
            break;
        case 'github':
            try {
                let reputation = await reputationController.fetchGitHubUserContributions(userId);
                let vc = await reputationController.issueVerifiedCredential(userId, reputation, email, "GitHub", "Contributions");
                res.send(vc);
            } catch (error) {
                res.status(500).send('Error issuing VC');
            }
            break;
        case 'reddit':
            try {
                let reputation = await reputationController.fetchRedditUserKarma(userId);
                let vc = await reputationController.issueVerifiedCredential(userId, reputation, email, "Reddit", "Karma");
                res.send(vc);
            } catch (error) {
                res.status(500).send('Error issuing VC');
            }
            break;
        case 'devto':
            try {
                let reputation = await reputationController.fetchDevToUserArticleCount(userId);
                let vc = await reputationController.issueVerifiedCredential(userId, reputation, email, "Dev.to", "Articles");
                res.send(vc);
            } catch (error) {
                res.status(500).send('Error issuing VC');
            }
            break;
        // Add more cases for other platforms like 'twitter', 'linkedin', etc.
        default:
            res.status(400).send('Invalid platform specified');
    }
});

// New route to just fetch and return reputation value
router.get('/value', async function(req, res, next) {
    try {
        let userId = req.query.userId;
        let platform = req.query.platform;
        let value;

        switch (platform) {
            case 'stackoverflow':
                value = await reputationController.fetchStackOverflowReputation(userId);
                break;
            case 'github':
                value = await reputationController.fetchGitHubUserContributions(userId);
                break;
            case 'reddit':
                value = await reputationController.fetchRedditUserKarma(userId);
                break;
            case 'devto':
                value = await reputationController.fetchDevToUserArticleCount(userId);
                break;
            // Add more cases for other platforms like 'twitter', 'linkedin', etc.
            default:
                return res.status(400).send('Invalid platform specified');
        }

        res.json({ platform: platform, value: value });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;