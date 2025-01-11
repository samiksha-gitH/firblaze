const mongoose = require("mongoose")
const RoleSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Unique role ID (e.g., "admin")
  description: { type: String, required: true }, // Description of the role
  permissions: [
    { type: String, ref: "Permission", required: true }, // References Permission IDs
  ],
})

module.exports = mongoose.model("Role", RoleSchema)
