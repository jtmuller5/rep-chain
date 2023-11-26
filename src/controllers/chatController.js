const { SendRequest, IssueFromTemplateResponse } = require('@trinsic/trinsic');

// Include necessary modules
var axios = require('axios').default; // for HTTP requests
// Include Trinsic SDK and other necessary modules

const TrinsicService = require("@trinsic/trinsic").TrinsicService;

const authToken = process.env.TRINSIC_AUTH_TOKEN;

// Initialize Trinsic ProviderServiceClient
const trinsic = new TrinsicService({ authToken: authToken });

async function sendMessageToFeed(message, feed) {

    try {
        const request = {
            templateId: "https://schema.trinsic.cloud/eloquent-bhaskara-z2gg41u9wxxg/message",
            include_governance: true,
            valuesJson: JSON.stringify({
                "content": message
            })
        };

        const email = feedToEmailMap[feed];

        console.log(`Sending message to feed ${feed} with email ${email}`)

        const response = await trinsic.credential().issueFromTemplate(request)

        await trinsic.credential().send(SendRequest.fromPartial({
            documentJson: response.documentJson,
            email: email,
            sendNotification: false,
        }));
    } catch (error) {
        console.error('Error sending message to feed:', error);
        throw error;
    }

}

const feedToEmailMap = {
    "Stack Overflow": "jtmuller5+3@gmail.com",
    "GitHub": "jtmuller5+4@gmail.com",
    "Reddit": "jtmuller5+5@gmail.com",
    "Dev.to": "jtmuller5+6@gmail.com"
};


module.exports = {
    sendMessageToFeed
};