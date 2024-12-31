
const getDrivers = async (req, res) => {
  
    try {
        // Use the native fetch without needing an external package
        const response = await fetch('https://api.openf1.org/v1/drivers?session_key=9662&meeting_key=1252');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data); // Send data to the frontend
    } catch (error) {
        console.error('Error fetching data from Ergast API:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
};

module.exports = { getDrivers };