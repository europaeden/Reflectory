const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.dialogflowWebhook = functions
  .region("europe-west1")
  .https.onRequest((req, res) => {
  const {queryResult} = req.body;
  const userMessage = queryResult.queryText;

  const db = admin.firestore();
  db.collection("logs")
      .add({
        message: userMessage,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        res.json({
          fulfillmentText: `You said: ${userMessage}`,
        });
      })
      .catch((error) => {
        console.error("Error saving log to Firestore", error);
        res.status(500).send("Error processing the request.");
      });
});
