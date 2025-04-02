require("dotenv").config();
//connecting to firebase realtime database
const admin = require("firebase-admin");
const serviceAccount = require("./chat-app-c925e-firebase-adminsdk-fbsvc-2a107bdf8f.json");

admin.initializeApp({
  credential:admin.credential.cert(serviceAccount),
  databaseURL:"https://chat-app-c925e-default-rtdb.firebaseio.com/",
});

const db = admin.database();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Anime Chat Backend is Running!");
});


// app.post("/send-messages" , async (req,res)=>{
//   try{

//     const{username, message} = req.body;

//     if(!username || !message){
//       return res.status(400).send("missing username or message")

//     }
//     const ref = db.ref("messages").push();
//     await ref.set({username, message, timestamp:Date.now()})
   
//     console.log("message stored")
//   }catch(error){
//     res.status(500).json({error:"failed to store message"});
    
//   };
  
// });
////////////////////////////////////////////////////////////////////////////
// app.get("/get-messages", async (req, res) => {
//   try {
//     const ref = db.ref("messages"); // Reference the "messages" node

//     ref.once("value", (snapshot) => {
//       const data = snapshot.val(); // Get all messages
//       console.log("📌 Retrieved messages:", data);
//       res.json(data || {}); // Send messages or empty object if none
//     });
//   } catch (error) {
//     console.error("❌ Error retrieving messages:", error);
//     res.status(500).send("Failed to retrieve messages");
//   }
// });


app.post("/search", async (req, res)=>{
  try{
    const {username, topic}= req.body;
    if (!username||!topic){
      return res.status(400).send("missing username or topic of search");
    }
    const ref = db.ref(`searches/${topic}/${username}`);
      await ref.set({username, topic, timestamp:Date.now()});
      console.log(`${username} searched for ${topic}`);
  }catch(error){
     console.error("Error storing search:", error);
    res.status(500).json({ error: "Failed to store search" });
  }
})

app.get("/get-users/:topic", async (req, res) => {
  try {
    const topic = req.params.topic;
    const ref = db.ref(`searches/${topic}`);

    ref.once("value", (snapshot) => {
      const data = snapshot.val();
      if (!data) return res.json([]); // If no users found, return empty array

      // Convert object format into array format
      const usersList = Object.values(data).map(user => ({
        username: user.username,
        timestamp: user.timestamp
      }));

      console.log(`Users searching for ${topic}:`, usersList);
      res.json(usersList);
    });

  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

app.post("/send-chat-request", async(req,res)=>{
  try{
    const{sender, receiver, topic} = req.body;
    if(!sender||!receiver||!topic){
      return res.status(400).send("missing sender , reciever or the topic");
    }
  
    const ref = db.ref(`requests/${receiver}/${sender}`);
    await ref.set({
      sender, 
      topic,
      timestamp:Date.now(),
      status: "pending",
    });

  console.log(`${sender} sent a chat request to ${receiver} for ${topic}`)
  res.json({ success: true, message: "Chat request sent!" });

    

  }catch(error){
    console.error("Error sending chat request:", error);
    res.status(500).json({ error: "Failed to send chat request" });
  }
})

app.get("/pending-requests/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const ref = db.ref(`requests/${username}`);
    const snapshot = await ref.once("value");
    
    if (!snapshot.exists()) {
      return res.json([]); // No pending requests
    }
    
    const requests = Object.values(snapshot.val());
    res.json(requests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});




/////////////////////////////////////////////////////////////////////////////////


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

