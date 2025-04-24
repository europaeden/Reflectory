const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

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
    
    // Extract message and metadata from Dialogflow CX format
    const tag = body.fulfillmentInfo?.tag || '';
    const userMessage = body.queryResult?.text || '';
    const parameters = body.queryResult?.parameters || {};
    const sessionInfo = body.sessionInfo || {};
    
    console.log('Tag:', tag);
    console.log('User Message:', userMessage);
    console.log('Session:', sessionInfo.session);

    let responseText = 'Default response';

    // Use tag instead of intentName for routing
    if (tag === 'daily_checkin' || tag === 'emotion_reflection') {
        responseText = "I hear you. How does that make you feel?";
    } else if (tag === 'greeting') {
        responseText = "Hello! How are you feeling today?";
    } else {
        responseText = "I'm here to listen. What's on your mind?";
    }

    // Dialogflow CX response format
    res.json({
        fulfillmentResponse: {
            messages: [{
                text: {
                    text: [responseText]
                }
            }]
        },
        sessionInfo: {
            parameters: {
                lastMessage: userMessage
            }
        }
    });
});
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - Visit http://localhost:${PORT}`);
});
