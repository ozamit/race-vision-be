const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import Mongoose

const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();


// Middleware
app.use(cors());
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


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
