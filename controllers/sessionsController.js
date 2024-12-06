
const getracesessionsforyear = async (req, res) => {
    try {
        const { year } = req.query; // Get the year from the request query
        if (!year) {
            return res.status(400).json({ message: 'Year is required' });
        }

        console.log("Fetching race sessions for year:", year);

        // Fetch race sessions from the API
        const response = await fetch(`https://api.openf1.org/v1/sessions?session_name=Race&year=${year}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Respond with the fetched data
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching race sessions for year:', error);
        return res.status(500).json({ message: 'Error fetching race sessions' });
    }
};

module.exports = { getracesessionsforyear };