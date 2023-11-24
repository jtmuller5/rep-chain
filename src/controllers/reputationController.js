// Include necessary modules
var axios = require('axios').default; // for HTTP requests
// Include Trinsic SDK and other necessary modules

import { TrinsicService } from "@trinsic/trinsic";

// Initialize Trinsic ProviderServiceClient
const trinsic = new TrinsicService({ authToken: "<auth token>" });


// Function to fetch Stack Overflow reputation
async function fetchStackOverflowReputation(userId) {
    try {
        const response = await axios.get(`https://api.stackexchange.com/2.3/users/${userId}?site=stackoverflow`);
        // Extract reputation value from the response
        const reputation = response.data.items[0].reputation;
        console.log(`Reputation for user ${userId} is ${reputation}`);
        return reputation;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error; // or return a default value/error message
    }
}

// Function to issue Verified Credentials
async function issueVerifiedCredential(reputationData) {
    try {
        const request = {
            templateId: "<your-credential-template-id>",
            include_governance: true,
            valuesJson: JSON.stringify({
                "userId": "<Stack Overflow User ID>",
                "reputation": "<Reputation Value>"
            })
        };
        const response = await trinsic.credential().issueFromTemplate(request);
        
    } catch (error) {
        // Handle error
    }
}

module.exports = {
    fetchStackOverflowReputation,
    issueVerifiedCredential
};
