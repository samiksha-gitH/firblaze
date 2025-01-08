import jwt from "jsonwebtoken"
import catchAsync from "./catchAsync.js"
import AppError from "../utils/AppError.js"

// Helper function to extract token
const getToken = (req) => {
  const cookieToken = req.cookies?.token
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null

  return cookieToken || headerToken
}

const auth = catchAsync(async (req, res, next) => {
  const token = getToken(req)

  if (!token) {
    return next(new AppError("Access denied. No token provided.", 401))
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user details to the request object
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    }

    next()
  } catch (error) {
    return next(new AppError("Access denied. Invalid or expired token.", 401))
  }
})

export default auth
