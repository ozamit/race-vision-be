// Import the Prediction model
const Prediction = require("../model/prediction");

// Save Predictions Controller
const savePredictions = async (req, res) => {
  try {
    // Extract data from the request body
    const { user, sessionKey, meetingKey, predictedOrder } = req.body;

    // Debugging: Print received data
    console.log("Received data:", { user, sessionKey, meetingKey, predictedOrder });

    // Validate required fields
    if (!sessionKey || !meetingKey || !predictedOrder) {
      console.error("Missing required fields:", { sessionKey, meetingKey, predictedOrder });
      return res.status(400).json({ message: "Error saving. Try later." });
    }

    if (!user) {
      console.error("Missing required fields:", { user });
      return res.status(400).json({ message: "Please Login first" });
    }

    // Check if a prediction already exists for the user and meetingKey
    const existingPrediction = await Prediction.findOne({ user, meetingKey });

    if (existingPrediction) {
      // Update the existing prediction
      existingPrediction.sessionKey = sessionKey;
      existingPrediction.predictedOrder = predictedOrder;
      const updatedPrediction = await existingPrediction.save();

      // Debugging: Log the updated prediction
    //   console.log("Prediction updated successfully:", updatedPrediction);

      // Send success response
      return res.status(200).json({ message: "Prediction updated successfully.", prediction: updatedPrediction });
    }

    // Create a new prediction document
    const newPrediction = new Prediction({
      user,
      sessionKey,
      meetingKey,
      predictedOrder,
    });

    // Save to the database
    const savedPrediction = await newPrediction.save();

    // Debugging: Log the saved prediction
    // console.log("Prediction saved successfully:", savedPrediction);

    // Send success response
    return res.status(201).json({ message: "Prediction saved successfully.", prediction: savedPrediction });
  } catch (error) {
    // Debugging: Log the error
    console.error("Error saving prediction:", error);

    // Send error response
    return res.status(500).json({ message: "An error occurred while saving the prediction.", error: error.message });
  }
};




// Get Predictions by User ID Controller
const getPredictionsByUserId = async (req, res) => {
    console.log("start:", req.body);
    try {
      // Extract user ID from request params
      const { userId } = req.body;
  
      // Debugging: Log the received user ID
      console.log("Fetching predictions for user ID:", userId);
  
      // Validate that user ID is provided
      if (!userId) {
        console.error("User ID is required.");
        return res.status(400).json({ message: "User ID is required." });
      }
  
      // Find all predictions for the given user ID
      const predictions = await Prediction.find({ user: userId });
  
      // Check if predictions were found
      if (predictions.length === 0) {
        console.log("No predictions found for user ID:", userId);
        return res.status(404).json({ message: "No predictions found for this user." });
      }
  
      // Debugging: Log the found predictions
      console.log("Predictions found:", predictions);
  
      // Send success response with predictions
      return res.status(200).json({ message: "Predictions retrieved successfully.", predictions });
    } catch (error) {
      // Debugging: Log the error
      console.error("Error fetching predictions:", error);
  
      // Send error response
      return res.status(500).json({ message: "An error occurred while fetching predictions.", error: error.message });
    }
  };
  
module.exports = { savePredictions, getPredictionsByUserId };
