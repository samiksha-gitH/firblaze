import express from "express"
import connectDB from "./config/db.js"
import "express-async-errors"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import { rateLimit } from "express-rate-limit"

import errorHandlerMiddleware from "./middleware/errorHandler.js"
import notFoundMiddleware from "./middleware/notFound.js"

// routes
import authRouter from "./route/auth.js"
import authenticateUser from "./middleware/authentication.js"
import mongoose from "mongoose"

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
