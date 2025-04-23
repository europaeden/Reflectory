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
    
    // Extract message and metadata
    const intentName = req.body?.intentInfo?.displayName || '';
    const userMessage = body.text || body.queryInput?.text?.text || '';
    const sentiment = body.sentimentAnalysisResult || {};
    const score = sentiment.score || 0;
    const magnitude = sentiment.magnitude || 0;

    console.log('Intent:', intentName);
    console.log('User Message:', userMessage);
    console.log('Sentiment Score:', score, 'Magnitude:', magnitude);

    let responseText = 'Thanks for sharing that. Can you tell me more?';

    // Only apply sentiment analysis to specific intents
    if (intentName === 'Daily Check-In' || intentName === 'Emotion Reflection') {
        if (score < -0.25) {
            responseText = "I'm really sorry you're feeling that way. Want to talk more about what's been bothering you?";
        } else if (score > 0.3) {
            responseText = "I'm glad to hear things are going well! Want to explore what's helped you lately?";
        } else {
            responseText = "Thanks for letting me know. Would you like to reflect a bit more?";
        }
    } else {
        // Fallback or non-targeted intent
        responseText = "Let's keep going. What would you like to talk about today?";
    }

    // Send back to Dialogflow CX
    res.json({
        fulfillment_response: {
            messages: [
                {
                    text: {
                        text: [responseText]
                    }
                }
            ]
        }
    });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - Visit http://localhost:${PORT}`);
});
