const { Schema, model } = require("mongoose");

const predictionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: [true, "User reference is required"],
  },
  sessionKey: {
    type: Number,
    required: [true, "Session key is required"],
  },
  meetingKey: {
    type: Number,
    required: [true, "Meeting key is required"],
  },
  predictedOrder: [
    {
      driverNumber: {
        type: Number,
        required: [true, "Driver number is required"],
      },
      fullName: {
        type: String,
        required: [true, "Driver full name is required"],
      },
      teamName: {
        type: String,
        required: [true, "Team name is required"],
      },
      teamColor: String,
      headshotUrl: String,
    },
  ],
  finalScore: {
    type: Number,
    default: 0, // Default score is 0 until calculated
  },
  isFinalized: {
    type: Boolean,
    default: false, // Indicates whether the prediction has been scored
  },
}, { timestamps: true });

const Prediction = model("Prediction", predictionSchema);

module.exports = Prediction;
