import AppError from "../utils/AppError.js"
import catchAsync from "../middleware/catchAsync.js"
import User from "../model/User.js"
import Role from "../model/Role.js"

// *********************************************************************************************************

/**
 * Set JWT token as an HTTP-only cookie.
 * @param {Object} res - The response object.
 * @param {String} token - The JWT token.
 */
const setCookie = (res, token) => {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  res.cookie("token", token, {
    expires: expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
}

// *********************************************************************************************************

/**
 * Register a new user.
 * @route POST /api/v1/auth/register
 */
const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role, permissions } = req.body

  // Validate input
  if (!name || !email || !password) {
    return next(new AppError("Name, email, and password are required", 400))
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return next(new AppError("Email already registered", 400))
  }

  // Set default role if not provided
  const userRole = role || "student"

  const newRole = await Role.create({
    roleName: role,
    permissions: permissions,
  })

  // Create the user
  const user = await User.create({ name, email, password, role: newRole._id })

  // Generate JWT and set cookie
  const token = user.createJWT()
  setCookie(res, token)

  // Respond with success
  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    token,
    user: { name: user.name, email: user.email, role: user.role },
  })
})

// *********************************************************************************************************

/**
 * Log in an existing user.
 * @route POST /api/v1/auth/login
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // Validate input
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400))
  }

  // Find user by email
  const user = await User.findOne({ email })
  if (!user) {
    return next(new AppError("Invalid email or password", 401)) // Generic error
  }

  // Verify password
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    return next(new AppError("Invalid email or password", 401)) // Generic error
  }

  // Generate token and set cookie
  const token = user.createJWT()
  setCookie(res, token)

  // Respond with user details
  res.status(200).json({
    status: "success",
    message: "Login successful",
    token,
    user: { name: user.name, email: user.email, role: user.role },
  })
})

// *********************************************************************************************************

/**
 * Log out the user.
 * @route POST /api/v1/auth/logout
 */
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  })
}

// *********************************************************************************************************

/**
 * Retrieve the authenticated user's profile.
 * @route GET /api/v1/auth/profile
 */
const profile = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("User not authenticated", 401))
  }

  res.status(200).json({
    status: "success",
    message: "Profile retrieved successfully",
    data: {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  })
}

// *********************************************************************************************************

export { register, login, logout, profile }
