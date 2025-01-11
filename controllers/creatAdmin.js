const AppError = require("../utils/AppError.js")
const catchAsync = require("../middlewares/catchAsync.js")
const User = require("../model/User.js")

// *********************************************************************************************************

/**
 * Create a new user (Super-Admin only).
 * @route POST /api/v1/super-admin/users
 */
const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role, permissions } = req.body

  if (!name || !email || !password || !role) {
    return next(
      new AppError("Name, email, password, and role are required", 400)
    )
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return next(new AppError("Email already registered", 400))
  }

  const validRoles = ["admin", "student"]
  if (!validRoles.includes(role)) {
    return next(
      new AppError(
        `Invalid role provided. Valid roles: ${validRoles.join(", ")}`,
        400
      )
    )
  }

  const assignedPermissions = role === "admin" ? permissions || {} : {}

  const user = await User.create({
    name,
    email,
    password,
    role,
    permissions: assignedPermissions,
  })

  res.status(201).json({
    status: "success",
    message: `User with role '${role}' created successfully`,
    user: { name: user.name, email: user.email, role: user.role },
  })
})

// *********************************************************************************************************

/**
 * Read all users (Super-Admin only).
 * @route GET /api/v1/super-admin/users
 */
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({}).select("-password")

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  })
})

// *********************************************************************************************************

/**
 * Get a specific user by ID (Super-Admin only).
 * @route GET /api/v1/super-admin/users/:id
 */
const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const user = await User.findById(id).select("-password")
  if (!user) {
    return next(new AppError("User not found", 404))
  }

  res.status(200).json({
    status: "success",
    data: { user },
  })
})

// *********************************************************************************************************

/**
 * Update a user's information (Super-Admin only).
 * @route PATCH /api/v1/super-admin/users/:id
 */
const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { name, email, role, permissions } = req.body

  const validRoles = ["admin", "student"]
  if (role && !validRoles.includes(role)) {
    return next(
      new AppError(
        `Invalid role provided. Valid roles: ${validRoles.join(", ")}`,
        400
      )
    )
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { name, email, role, permissions },
    { new: true, runValidators: true }
  ).select("-password")

  if (!updatedUser) {
    return next(new AppError("User not found", 404))
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: { user: updatedUser },
  })
})

// *********************************************************************************************************

/**
 * Delete a user by ID (Super-Admin only).
 * @route DELETE /api/v1/super-admin/users/:id
 */
const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const user = await User.findByIdAndDelete(id)
  if (!user) {
    return next(new AppError("User not found", 404))
  }

  res.status(204).json({
    status: "success",
    message: "User deleted successfully",
  })
})

// *********************************************************************************************************

export { createUser, getAllUsers, getUserById, updateUser, deleteUser }
