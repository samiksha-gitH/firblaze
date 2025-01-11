const connectDB = require("../config/db")
require("dotenv").config()
const Permission = require("./models/Permission")

const permissions = [
  { _id: "view_users", description: "Can view users" },
  { _id: "edit_users", description: "Can edit user details" },
  { _id: "edit_admin", description: "Can edit admin details" },
  { _id: "create_courses", description: "Can create courses" },
  { _id: "view_courses", description: "Can view courses" },
]

const seedPermissions = async () => {
  try {
    await connectDB(process.env.MONGO_URI_TEST)

    for (const permission of permissions) {
      try {
        await Permission.create(permission)
        console.log(`Permission "${permission._id}" added.`)
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Permission "${permission._id}" already exists.`)
        } else {
          throw error
        }
      }
    }

    console.log("Permissions seeding completed.")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding permissions:", error)
    process.exit(1)
  }
}

seedPermissions()
