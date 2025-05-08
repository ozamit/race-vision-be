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
  
      // Try to find the race result for the requested sessionKey
      let raceResult = await RaceResult.findOne({ sessionKey });
  
      if (!raceResult) {
        console.log(`Race result not found for sessionKey: ${sessionKey}. Falling back to sessionKey 2500...`);
        raceResult = await RaceResult.findOne({ sessionKey: 2500 });
  
        if (!raceResult) {
          return res.status(404).json({ message: 'Race result not found for provided sessionKey or fallback sessionKey 2500' });
        }
      }
  
      res.status(200).json({
        message: 'Race result retrieved successfully',
        raceResult,
      });
  
    } catch (error) {
      console.error('Error retrieving race result:', error);
      res.status(500).json({ message: 'Error retrieving race result' });
    }
  };

  const testing = async (req, res) => {
    console.log("START - Received saveFinalRaceResultFromAdminToDB");
  }
  

  const saveFinalRaceResultFromAdminToDB = async (req, res) => {
    console.log("START - Received saveFinalRaceResultFromAdminToDB");
  
    try {
      let { sessionKey, raceResultOrder } = req.body;
      console.log("Received sessionKey:", sessionKey);
      console.log("Received raceResultOrder:", raceResultOrder);
  
      // Validate sessionKey
      sessionKey = Number(sessionKey);
      if (!sessionKey || !Array.isArray(raceResultOrder)) {
        return res.status(400).json({ message: 'sessionKey (number) and raceResultOrder (array) are required' });
      }
  
      // Sanitize and structure raceResultOrder
      const preparedOrder = raceResultOrder.map((item, index) => ({
        driver_number: Number(item.driver_number),
        position: Number(item.position ?? index + 1), // fallback to order index if no position given
      }));
  
      // Validate each item (optional, uncomment to enforce)
      // for (const item of preparedOrder) {
      //   if (
      //     typeof item.driver_number !== 'number' ||
      //     typeof item.position !== 'number'
      //   ) {
      //     return res.status(400).json({ message: 'Each race result must include valid driver_number and position' });
      //   }
      // }
  
      let raceResult = await RaceResult.findOne({ sessionKey });
  
      if (raceResult) {
        // Update existing result
        raceResult.raceResultOrder = preparedOrder;
        await raceResult.save();
        console.log('Race result updated:', raceResult);
      } else {
        // Create new race result
        raceResult = new RaceResult({
          sessionKey,
          raceResultOrder: preparedOrder,
        });
        await raceResult.save();
        console.log('New race result saved:', raceResult);
      }
  
      res.status(200).json({
        message: 'Race result saved successfully',
        raceResult,
      });
  
    } catch (error) {
      console.error('Error saving race result:', error);
      res.status(500).json({ message: 'Error saving race result' });
    }
  };
  


module.exports = { testing, getAllPositions, saveFinalRaceResultToDB, getRaceResultFromDB, saveFinalRaceResultFromAdminToDB };
