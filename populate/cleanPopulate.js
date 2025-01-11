const connectDB = require("../config/db")
require("dotenv").config("./")

// const schema = require("../models/User")
// const schema = require("../models/PermissionSchema")
const schema = require("../models/Role")

const start = async () => {
  try {
    // console.log(process.env.MONGO_URI_TEST)

    await connectDB(process.env.MONGO_URI_TEST)
    await schema.deleteMany()
    console.log("Successfull!")
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
