const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔑 Plik z kluczem serwisowym
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/send", async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    notification: { title, body },
    token: token,
  };

  try {
    await admin.messaging().send(message);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send({ success: false, error });
  }
});

app.get("/", (req, res) => {
  res.send("FCM backend działa 🔥");
});

// Port nasłuchu
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
