const Driver = require('../model/driver');
const gridDriver = require('../model/gridDriver');


const getDrivers = async (req, res) => {
  
    try {
        const response = await fetch('https://api.openf1.org/v1/drivers?session_key=9662&session_key=9693');
        
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

const getGridDriversLocalDB = async (req, res) => {
    try {
      // Fetch and sort grid drivers by __v ascending
      const gridDrivers = await gridDriver.find().sort({ __v: 1 });
  
      // Respond with the sorted drivers
      res.status(200).json(gridDrivers);
    } catch (error) {
      console.error('Error fetching drivers from DB:', error);
      res.status(500).json({ error: 'Failed to fetch drivers from the database' });
    }
  };
  


const getDriversLocalDB = async (req, res) => {
    try {
      // Fetch all drivers from the database
      const drivers = await Driver.find();
  
      // Respond with the retrieved drivers
      res.status(200).json(drivers);
    } catch (error) {
      // Handle errors and send appropriate response
      console.error('Error fetching drivers from DB:', error);
      res.status(500).json({ error: 'Failed to fetch drivers from the database' });
    }
  };

const saveDriversToDB = async (req, res) => {
    try {
        // Fetch data from the external API
        console.log('Fetching drivers from the API...');
        const response = await fetch('https://api.openf1.org/v1/drivers?meeting_key=1254&session_key=9693');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('data: ', data);

        // Track newly added drivers
        const newlySavedDrivers = [];

        for (const driver of data) {
            // Check if the driver already exists in the database
            const existingDriver = await Driver.findOne({ driver_number: driver.driver_number });

            if (!existingDriver) {
                // Prepare the driver data
                const driverData = {
                    broadcast_name: driver.broadcast_name,
                    country_code: driver.country_code,
                    first_name: driver.first_name,
                    full_name: driver.full_name,
                    headshot_url: driver.headshot_url,
                    last_name: driver.last_name,
                    driver_number: driver.driver_number,
                    team_colour: driver.team_colour,
                    team_name: driver.team_name,
                    name_acronym: driver.name_acronym,
                };

                // Save the driver to the database
                const savedDriver = await Driver.create(driverData);
                newlySavedDrivers.push(savedDriver);
            }
        }

        // Send a response back to the client
        res.status(200).json({
            message: 'Drivers processed successfully.',
            newlySavedDrivers,
        });
    } catch (error) {
        console.error('Error saving drivers to the database:', error);
        res.status(500).json({
            message: 'Failed to process drivers.',
            error: error.message,
        });
    }
};


module.exports = { getDrivers, getGridDriversLocalDB, getDriversLocalDB, saveDriversToDB };