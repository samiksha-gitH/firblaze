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
    description: "Administrator with limited permissions",
    permissions: ["view_users", "edit_users", "create_courses"],
  },
  {
    _id: "instructor",
    description: "Can create and manage their own courses",
    permissions: ["create_courses"],
  },
  {
    _id: "learner",
    description: "Can view courses",
    permissions: ["view_courses"],
  },
]

const seedRoles = async () => {
  try {
    await connectDB(process.env.MONGO_URI_TEST)

    for (const role of roles) {
      try {
        await Role.create(role)
        console.log(`Role "${role._id}" added.`)
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Role "${role._id}" already exists.`)
        } else {
          throw error
        }
      }
    }

    console.log("Roles seeding completed.")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding roles:", error)
    process.exit(1)
  }
}

seedRoles()
