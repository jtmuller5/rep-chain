// Include necessary modules
var axios = require('axios').default; // for HTTP requests
// Include Trinsic SDK and other necessary modules

const TrinsicService = require("@trinsic/trinsic").TrinsicService;

const authToken = process.env.TRINSIC_AUTH_TOKEN;

// Initialize Trinsic ProviderServiceClient
const trinsic = new TrinsicService({ authToken: authToken });

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
async function issueVerifiedCredential(userId, reputationValue) {
    try {

        let currentDate = new Date();

        const request = {
            templateId: "https://schema.trinsic.cloud/eloquent-bhaskara-z2gg41u9wxxg/stackoverflowreputation",
            include_governance: true,
            valuesJson: JSON.stringify({
                "userId": userId,
                "reputation": reputationValue,
                "checkDate": currentDate // Assuming checkDate is a string in the format 'YYYY-MM-DD'
            })
        };
        const response = await trinsic.credential().issueFromTemplate(request);
        return response; // Return the response or handle it as needed
    } catch (error) {
        // Handle error
        console.error(error);
        throw error; // or return a default value/error message
    }
}


module.exports = {
    fetchStackOverflowReputation,
    issueVerifiedCredential
};
