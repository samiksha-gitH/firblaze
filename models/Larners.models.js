const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const User = require("./User.js");

// Define the Learner/Student Schema
const studentSchema = new mongoose.Schema(
  {
   
    dateOfBirth: {
      type: Date,
      required: false, // Optional, based on use case
    },
    enrolledCourses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course", // Reference to Course collection
        },
        enrollmentDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    role: {
      type: String,
      enum: ["student"],
      default: "student",
    },
    progress: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        completedPercentage: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
);

// Export the model
const Student = User.discriminator("Student", studentSchema);

module.exports = Student;
