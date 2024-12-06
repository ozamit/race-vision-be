const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for frontend access
app.use(express.json());

// Basic Route
app.get('/', (req, res) => { res.send('Hello, World!');});
app.use("/drivers", require("./routes/drivers")); 
app.use("/positions", require("./routes/positions"));
app.use("/sessions", require("./routes/sessions"));


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})