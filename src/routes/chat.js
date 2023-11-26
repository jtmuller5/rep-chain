var express = require('express');

var router = express.Router();
var chatController = require('../controllers/chatController');

// Route to create new messages in a specified feed
router.post('/message', async function (req, res, next) {
    try {
        let message = req.body.message;
        let feed = req.body.feed;

        console.log('Body:', req.body)
        await chatController.sendMessageToFeed(message, feed);

        res.send('Message sent to feed');
    } catch (error) {
        res.status(500).send('Error sending message to feed');
    }
}
);

module.exports = router;
