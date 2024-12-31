const { Schema, model } = require("mongoose");

const predictionSchema = new Schema(
  {
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
        session_key: {
          type: Number,
          required: [true, "Session key is required"],
        },
        meeting_key: {
          type: Number,
          required: [true, "Meeting key is required"],
        },
        broadcast_name: {
          type: String,
          required: [true, "Broadcast name is required"],
        },
        country_code: {
          type: String,
        },
        first_name: {
          type: String,
        },
        full_name: {
          type: String,
          required: [true, "Full name is required"],
        },
        headshot_url: {
          type: String,
        },
        last_name: {
          type: String,
        },
        driver_number: {
          type: Number,
          required: [true, "Driver number is required"],
        },
        team_colour: {
          type: String,
        },
        team_name: {
          type: String,
        },
        name_acronym: {
          type: String,
        },
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
  },
  { timestamps: true }
);

const Prediction = model("Prediction", predictionSchema);

module.exports = Prediction;
