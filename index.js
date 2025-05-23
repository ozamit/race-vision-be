const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import Mongoose
const cron = require('node-cron');


const app = express();
const PORT = process.env.PORT || 5001;
require('dotenv').config();


// CORS options
const corsOptions = {
  origin: ['https://race-vision-fe.onrender.com', 'http://localhost:3000'], // Add your dev and prod origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

// Middleware
// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "your_mongodb_connection_string_here";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.use("/drivers", require("./routes/drivers")); 
app.use("/positions", require("./routes/positions"));
app.use("/sessions", require("./routes/sessions"));
app.use("/users", require("./routes/users"));
app.use("/predictions", require("./routes/predictions"));
app.use("/ai", require("./routes/ai"));



const RENDER_URL = 'https://race-vision-fe.onrender.com/';

// CET is UTC+1 (ignoring DST)
const CET_OFFSET = 1;

// Hours in CET for pinging: 7 to 23
const startCETHour = 7;
const endCETHour = 23;

// Convert CET hours to UTC for the cron expression
const startUTCHour = (startCETHour - CET_OFFSET + 24) % 24; // 6
const endUTCHour = (endCETHour - CET_OFFSET + 24) % 24;     // 22

const pingServer = async () => {
  try {
    const response = await fetch(RENDER_URL);
    if (response.ok) {
      console.log(`[${new Date().toISOString()}] Server ping successful.`);
    } else {
      console.log(`[${new Date().toISOString()}] Server ping failed: ${response.status}`);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Ping error:`, error.message);
  }
};

// Schedule cron: every 15 minutes between startUTCHour and endUTCHour
cron.schedule(`*/15 ${startUTCHour}-${endUTCHour} * * *`, () => {
  pingServer();
});

console.log(`Cron job started: pinging every 10 minutes from ${startCETHour}:00 to ${endCETHour}:59 CET`);



// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
