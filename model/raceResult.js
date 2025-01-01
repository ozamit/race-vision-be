const { Schema, model } = require("mongoose");

const raceResultSchema = new Schema(
  {
    sessionKey: {
      type: Number,
      required: [true, "Session key is required"],
    },
    raceResultOrder: [
      {
        driver_number: {
          type: Number,
          required: [true, "Driver number is required"],
        },
        position: {
          type: Number,
          required: [true, "Driver number is required"],
        },
      },
    ],
  },
  { timestamps: true }
);

const RaceResult = model("RaceResult", raceResultSchema);

module.exports = RaceResult;
