const RaceResult = require('../model/raceResult'); // Adjust the path as needed

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
            const driverNumber = data[data.length - 1].driver_number; // Extract the driver number from the last object
            results.push({ position, driverNumber });
        }

        res.json(results); // Send the array of results to the frontend
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
};

const saveFinalRaceResultToDB = async (req, res) => {
    try {
      console.log("Received sessionKey:", req.query.sessionKey);
  
      const sessionKey = req.query.sessionKey;
      if (!sessionKey) {
        return res.status(400).json({ message: 'Session key is required' });
      }
  
      // Define the positions (example: top 3)
      const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      const raceResultOrder = [];
  
      // Fetch race results for each position
      for (const position of positions) {
        console.log(`Fetching position ${position}`);
        const response = await fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}&position=${position}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        const lastDriver = data[data.length - 1]; // Extract last driver information
        console.log("lastDriver", lastDriver);
        
        raceResultOrder.push({
          driver_number: lastDriver.driver_number,
          position: lastDriver.position,
        });
      }
    
      // Check if race result already exists for the given sessionKey
      let raceResult = await RaceResult.findOne({ sessionKey });
  
      if (raceResult) {
        // Update the existing race result
        raceResult.raceResultOrder = raceResultOrder;
        await raceResult.save();  // Save without reassigning the variable
        console.log('Race result updated:', raceResult);
      } else {
        // Create a new race result
        const newRaceResult = new RaceResult({
          sessionKey,
          raceResultOrder,
        });
        await newRaceResult.save();  // Save the new race result
        console.log('New race result saved:', newRaceResult);
      }
  
      res.status(200).json({
        message: 'Race result processed successfully',
        raceResult,  // Return the updated or created race result
      });
    } catch (error) {
      console.error('Error processing race result:', error);
      res.status(500).json({ message: 'Error processing race result' });
    }
  };


  
  const getRaceResultFromDB = async (req, res) => {
    try {
      const { sessionKey } = req.query;
  
      if (!sessionKey) {
        return res.status(400).json({ message: 'Session key is required' });
      }
  
      // Retrieve the race result from the database using the sessionKey
      let raceResult = await RaceResult.findOne({ sessionKey });
  
      // If the race result doesn't exist, call the saveFinalRaceResultToDB function to fetch and save it
      if (!raceResult) {
        console.log(`Race result not found for sessionKey: ${sessionKey}, fetching and saving...`);
        
        // Call the saveFinalRaceResultToDB function within this controller
        const saveResultResponse = await saveFinalRaceResultToDB(req, res);
  
        // If saving was successful, set the new race result
        if (saveResultResponse.status === 200) {
          // Use the sessionKey to fetch the new result from the database after saving
          raceResult = await RaceResult.findOne({ sessionKey });
        } else {
          // If the save operation failed, return the error message
          return res.status(saveResultResponse.status).json(saveResultResponse.body);
        }
      }

    
      res.status(200).json({
        message: 'Race result fetched successfully',
        raceResult,
      });
    } catch (error) {
      console.error('Error fetching race result:', error);
      res.status(500).json({ message: 'Error fetching race result' });
    }
  };
  

module.exports = { getAllPositions, saveFinalRaceResultToDB, getRaceResultFromDB };
