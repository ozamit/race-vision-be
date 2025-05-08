const Session = require('../model/session'); // Assuming your Session model is in the models folder

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
        const year = 2025; // Extract the current year

        // console.log("First, fetching all race sessions for year:", year);

        // Fetch race sessions for the current year from the API
        const response = await fetch(`https://api.openf1.org/v1/sessions?session_name=Race&year=${year}`);

        if (response.status !== 200) {
            // console.log(`HTTP error! Status: ${response.status}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // console.log("response.status: ", response.status);
        const sessions = await response.json();
        const data = {sessions: sessions};

        // Debug log the raw response to inspect the structure
        // console.log("API Response Data:", data);

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
            // console.log("lastRace: ", lastRace);

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


const saveSessionsToDB = async (req, res) => {
    try {
        console.log("start saveSessionsToDB");

        // Fetch race sessions from the API
        const response = await fetch(`https://api.openf1.org/v1/sessions?session_name=Race&year=2025`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        let newSessionsCount = 0;

        for (const session of data) {
            // Check if the session already exists in the DB
            const existingSession = await Session.findOne({ session_key: session.session_key });

            if (!existingSession) {
                // Save the new session to the DB
                const newSession = new Session(session);
                await newSession.save();
                newSessionsCount++;
            }
        }

        // Respond with the number of new sessions added
        return res.status(200).json({ message: `${newSessionsCount} new session(s) added to the database.` });
    } catch (error) {
        console.error('Error processing race sessions:', error);
        return res.status(500).json({ message: 'Error processing race sessions' });
    }
};

const getNextRaceSessionFromDB = async (req, res) => {
    try {
        const currentDate = new Date(); // Get the current date

        // Query the database for sessions with a date in the future
        const nextRace = await Session.find({ date_start: { $gt: currentDate } })
            .sort({ date_start: 1 }) // Sort by start date in ascending order
            .limit(1); // Only get the next session

        if (nextRace.length > 0) {
            // If a future session is found, respond with it
            return res.status(200).json(nextRace[0]);
        }

        // If no future sessions are found, call saveSessionsToDB to refresh the database
        console.log("No future race session found. Attempting to refresh sessions...");
        await saveSessionsToDB(req, res);

        // After refreshing, inform the user that no future sessions are currently available
        return res.status(404).json({ message: "No future session found. Please check later." });
    } catch (error) {
        console.error('Error finding the next race session:', error);
        return res.status(500).json({ message: 'Error finding the next race session' });
    }
};

const getRaceSessionsForYearFromDB = async (req, res) => {
    try {
        const year = 2025;

        // Fetch race sessions from the database for the given year
        const sessions = await Session.find({
            year: year, // Filter sessions by year
            session_name: 'Race' // Ensure only race sessions are retrieved
        });

        if (!sessions || sessions.length === 0) {
            // If no sessions are found, respond with a 404 status
            return res.status(404).json({ message: 'No race sessions found for the year.' });
        }

        // Respond with the fetched sessions
        return res.status(200).json(sessions);
    } catch (error) {
        console.error('Error fetching race sessions for year:', error);
        return res.status(500).json({ message: 'Error fetching race sessions' });
    }
};




module.exports = { getracesessionsforyear, getNextRaceSession, saveSessionsToDB, getNextRaceSessionFromDB, getRaceSessionsForYearFromDB };