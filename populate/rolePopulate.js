const connectDB = require("../config/db")
require("dotenv").config()
const Role = require("./models/Role")

const roles = [
  {
    _id: "super_admin",
    description: "Super Administrator with all permissions",
    permissions: ["view_users", "edit_admin", "edit_users", "create_courses"],
  },
  {
    _id: "admin",
    description: "Administrator with all permissions",
    permissions: ["view_users", "edit_users", "create_courses"],
  },
  {
    _id: "instructor", // First instructor role
    description: "Can create and manage their own courses",
    permissions: ["create_courses"],
  },
  {
    _id: "learner", // Changed _id to make it unique
    description: "Can view courses",
    permissions: ["view_courses"],
  },
]

const start = async () => {
  try {
    // Connect to the database
    await connectDB(process.env.MONGO_URI_TEST)

    // Insert roles into the database
    const res = await Role.insertMany(roles)
    console.log("Roles added", res)

    process.exit(0)
  } catch (error) {
    console.error("Error adding roles:", error)
    process.exit(1)
  }
}

start()
