const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const path = require('path');
const app = express();

// Serve static files from 'pages' directory
app.use(express.static(path.join(__dirname, 'pages')));
// Serve static files from root directory (for styles.css)
app.use(express.static(__dirname));
app.use(express.json());

// Serve Home.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'Home.html'));
});

app.post('/webhook', (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    function welcome(agent) {
        agent.add('Welcome! How can I assist you?');
    }

    function fallback(agent) {
        agent.add('I didn’t understand that. Can you try again?');
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);

    agent.handleRequest(intentMap);
});

app.listen(3000, () => {
    console.log('Server running on port 3000 - Visit http://localhost:3000');
});
