require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const {SessionsClient} = require('@google-cloud/dialogflow-cx');

const app = express();
const client = new SessionsClient({
    apiEndpoint: `${process.env.DIALOGFLOW_LOCATION}-dialogflow.googleapis.com`
});

// Configuration from environment variables
const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const location = process.env.DIALOGFLOW_LOCATION;
const agentId = process.env.DIALOGFLOW_AGENT_ID;
const languageCode = 'en';

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(__dirname));

// Serve Home.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'Home.html'));
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
    console.log('Webhook request received:', JSON.stringify(req.body, null, 2));
    const body = req.body;
    
    try {
        const sessionId = Math.random().toString(36).substring(7);
        const sessionPath = client.projectLocationAgentSessionPath(
            projectId,
            location,
            agentId,
            sessionId
        );

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: body.queryResult.text
                },
                languageCode: 'en'
            }
        };


        // Extract the agent's response
        const [response] = await client.detectIntent(request);
        for (const message of response.queryResult.responseMessages) {
          if (message.text) {
            console.log(`Agent Response: ${message.text.text}`);
          }
        }

        // Return response in Dialogflow CX webhook format
        res.json({
            fulfillmentResponse: {
                messages: [{
                    text: {
                        text: [responseMessages]
                    }
                }]
            },
            sessionInfo: {
                parameters: {
                    currentPage: response.queryResult.currentPage?.displayName,
                    matchType: response.queryResult.match?.matchType,
                    confidence: response.queryResult.match?.confidence
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            fulfillmentResponse: {
                messages: [{
                    text: {
                        text: ["I'm having trouble processing that right now."]
                    }
                }]
            }
        });
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - Visit http://localhost:${PORT}`);
});
