import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  petStatus: {
    type: String,
    enum: ["available", "adopted", "under approval"],
    default: "available",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  RequestedAt: {
    type: Date,
  },
  adminApproval: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
      },
      dateAndTime: {
        type: Date,
      },
    },
});

// Create the model
const Pet = new mongoose.model("Pets", petSchema);

// Export the model
export default Pet;

