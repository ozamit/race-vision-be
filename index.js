const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for frontend access
app.use(express.json());

// Route to fetch data from Ergast API
app.get('/api/data', async (req, res) => {
    try {
        // Use the native fetch without needing an external package
        const response = await fetch('https://api.openf1.org/v1/drivers?session_key=9606&meeting_key=1246');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data); // Send data to the frontend
    } catch (error) {
        console.error('Error fetching data from Ergast API:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})