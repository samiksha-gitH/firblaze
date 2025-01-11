const connectDB = require("../config/db")
require("dotenv").config()
const Permission = require("../models/PermissionSchema")


const permissions = [
  { _id: "view_users", description: "Can view user data" },
  { _id: "edit_users", description: "Can edit user data" },
  { _id: "create_courses", description: "Can create new courses" },
]

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI_TEST)
    const res = await Permission.insertMany(permissions)
    console.log("Permissions added", res)

    process.exit(0)
  } catch (error) {
    console.error("Error adding permissions:", error)
    process.exit(1)
  }
}

start()
