const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: [true, "Please provide name"] }, // User's full name
  email: { type: String, required: true, unique: true }, // Unique email
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ["learner", "instructor", "admin", "super-admin"],
    required: true,
  }, // References Role ID
  profilePicture: {
    type: String,
    default: 'default.jpg'
},
  isActive: { type: Boolean, default: true }, // User status (active/inactive)
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }, // Timestamp for user creation
},
  { timestamps: true, discriminatorKey: "role" }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "15h",
    }
  )
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model("User", UserSchema)
