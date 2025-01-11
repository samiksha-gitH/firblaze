const express = require("express")
const connectDB = require("./config/db.js")
require("express-async-errors")
require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const { rateLimit } = require("express-rate-limit")

const errorHandlerMiddleware = require("./middlewares/errorHandler.js")
const notFoundMiddleware = require("./middlewares/notFound.js")

// routes
const authRouter = require("./routes/authRoutes.js")
const authenticateUser = require("./middlewares/authentication.js")
const mongoose = require("mongoose")

// const corsOptions = {
//   origin: `${process.env.FRONTEND_URL}`, // Frontend's URL
//   credentials: true,
// }

const app = express()

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
)
app.use(cors())
// app.use(cors(corsOptions))
app.use(helmet())
app.use(cookieParser())
app.use(express.json())

app.use("/api/v1/auth", authRouter)

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = process.env.PORT || 3000

const dbURI =
  process.env.NODE_ENV === "PRODUCTION"
    ? process.env.MONGO_URI
    : process.env.MONGO_URI_TEST

let server

const start = async () => {
  try {
    await connectDB(dbURI)
    server = app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  } catch (error) {
    // console.error("Server error:", error.message)
    process.exit(1) // Exit the process with an error code
  }
}

start()
