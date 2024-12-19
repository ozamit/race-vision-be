
const getAllPositions = async (req, res) => {

    try {
        console.log("Received sessionKey:", req.query.sessionKey);

        const sessionKey = req.query.sessionKey;
        if (!sessionKey) {
            return res.status(400).json({ message: 'Session key is required' });
        }

        const positions = [1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20]; // Positions to fetch
        const results = [];

        for (const position of positions) {
            const response = await fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}&position=${position}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Data:', data);
            const driverNumber = data[data.length - 1].driver_number; // Extract the driver number from the last object
            results.push({ position, driverNumber });
        }

        res.json(results); // Send the array of results to the frontend
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
};


module.exports = { getAllPositions };
