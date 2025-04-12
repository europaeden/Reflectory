const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

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
