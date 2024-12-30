
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

const getNextRaceSession = async (req, res) => {
    try {
        const currentDate = new Date(); // Get the current date
        const year = 2024; // Extract the current year

        console.log("First, fetching all race sessions for year:", year);

        // Fetch race sessions for the current year from the API
        const response = await fetch(`https://api.openf1.org/v1/sessions?session_name=Race&year=${year}`);

        if (response.status !== 200) {
            console.log(`HTTP error! Status: ${response.status}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("response.status: ", response.status);
        const sessions = await response.json();
        const data = {sessions: sessions};

        // Debug log the raw response to inspect the structure
        console.log("API Response Data:", data);

        // Check if `sessions` exists, is an array, and is not empty
        if (data.sessions === 0) {
            console.log("No race sessions found in the response.");
            return res.status(404).json({ message: 'No race sessions found for the year.' });
        }

        // Filter sessions to find the next one based on the current date
        const nextRace = data.sessions
            .filter(session => new Date(session.date) > currentDate) // Only sessions with a date in the future
            .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date, ascending
            [0]; // Get the earliest session

        if (nextRace) {
            // Respond with the next race session if found
            return res.status(200).json(nextRace);
        }

        console.log("No future race session found. Fetching the last race session.");

        // If no future race session is found, find the last race session
        const lastRace = data.sessions
            // .filter(session => new Date(session.date) <= currentDate) // Only sessions with a date in the past
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, descending
            .pop();
            // [0]; // Get the most recent past session
            console.log("lastRace: ", lastRace);

        if (lastRace) {
            // Respond with the last race session if found
            return res.status(200).json(lastRace);
        }

        // If neither future nor past races are found, respond with a 404 status
        return res.status(404).json({ message: 'No race sessions found for the year.' });
    } catch (error) {
        console.error('Error fetching race sessions:', error);
        return res.status(500).json({ message: 'Error fetching race sessions' });
    }
};

// module.exports = {
//     getNextRaceSession
// };


module.exports = { getracesessionsforyear, getNextRaceSession };