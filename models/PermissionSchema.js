const mongoose = require("mongoose")

const PermissionSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Unique permission ID (e.g., "view_users")
  description: { type: String, required: true }, // Description of the permission
})

module.exports = mongoose.model("Permission", PermissionSchema)
