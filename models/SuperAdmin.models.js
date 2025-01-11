const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const User = require("./User.js");

// Define the Super Admin Schema
const superAdminSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["super_admin"],
      default: "super_admin",
    },    
  },
);

// Export the model
const SuperAdmin = User.discriminator("SuperAdmin", superAdminSchema);
module.exports = SuperAdmin;
