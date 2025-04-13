const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'pages' directory
app.use(express.static(path.join(__dirname, 'pages')));
// Serve static files from root directory (for styles.css)
app.use(express.static(__dirname));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'Home.html'));
});

// Webhook endpoint
app.post("/webhook", (req, res) => {
    console.log("Webhook request received:", req.body);
    
    const userMessage = req.body.queryResult.queryText;  
    let botResponse = "I didn't understand that.";

    if (userMessage.includes("hello")) {
        botResponse = "Hi there! How can I assist you with journaling today?";
    } else if (userMessage.includes("journal")) {
        botResponse = "Great! What would you like to write about today?";
    }

    res.json({
        fulfillmentText: botResponse,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
