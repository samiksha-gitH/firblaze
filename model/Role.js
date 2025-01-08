const RoleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    enum: ["super-admin", "admin", "student"],
    default: "student",
  },
  permissions: {
    addCourses: { type: Boolean, default: false },
    addStudents: { type: Boolean, default: false },
  },
})

export default mongoose.model("Role", RoleSchema)
