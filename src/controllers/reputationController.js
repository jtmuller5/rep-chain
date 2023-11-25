const { SendRequest } = require('@trinsic/trinsic');
const { request, gql } = require('graphql-request');

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

async function fetchGitHubUserContributions(username) {
    const endpoint = 'https://api.github.com/graphql';
    const graphqlQuery = gql`
        query userContributions($username: String!) {
            user(login: $username) {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                    }
                }
            }
        }
    `;

    const variables = {
        username
    };

    try {
        const headers = {
            Authorization: `bearer ${process.env.GITHUB_TOKEN}`
        };
        const response = await request(endpoint, graphqlQuery, variables, headers);
        return response.user.contributionsCollection.contributionCalendar.totalContributions;
    } catch (error) {
        console.error('Error fetching GitHub user contributions:', error);
        throw error;
    }
}

async function fetchDevToUserArticleCount(username) {
    try {
        const response = await axios.get(`https://dev.to/api/articles?username=${username}`);
        // The response data is an array of articles
        const articleCount = response.data.length; // Count of articles
        return articleCount;
    } catch (error) {
        console.error('Error fetching Dev.to user articles:', error);
        throw error;
    }
}

async function fetchRedditUserKarma(username) {
    try {
        const response = await axios.get(`https://www.reddit.com/user/${username}/about.json`);
        const karma = response.data.data.total_karma;  // Extracting total karma
        return karma;
    } catch (error) {
        console.error('Error fetching Reddit user karma:', error);
        throw error;
    }
}

// Function to issue Verified Credentials
async function issueVerifiedCredential(userId, reputationValue, email, platform, metric) {
    try {

        let currentDate = new Date();

        const request = {
            templateId: "https://schema.trinsic.cloud/eloquent-bhaskara-z2gg41u9wxxg/stack-overflow-reputation",
            include_governance: true,
            valuesJson: JSON.stringify({
                "User": userId,
                "Value": reputationValue,
                "Date": currentDate, // Assuming checkDate is a string in the format 'YYYY-MM-DD',
                "Platform": platform,
                "Metric": metric,
            })
        };

        const response = await trinsic.credential().issueFromTemplate(request);

        trinsic.credential().send(SendRequest.fromPartial({
            documentJson: response.documentJson,
            email: email,
            sendNotification: true,
        }))
        return response; // Return the response or handle it as needed
    } catch (error) {
        // Handle error
        console.error(error);
        throw error; // or return a default value/error message
    }
}


module.exports = {
    fetchStackOverflowReputation,
    fetchGitHubUserContributions,
    fetchRedditUserKarma,
    fetchDevToUserArticleCount,
    issueVerifiedCredential
};
