const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    employeeKey: { type: String, required: true },
    role: { type: String, trim: true, maxlength: 100, default: "" },
    workDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    checkIn: { type: Date, required: true },
    checkOut: Date,
    minutesWorked: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

attendanceSchema.index(
  { workDate: 1, employeeKey: 1 },
  { unique: true, partialFilterExpression: { checkOut: { $exists: false } } }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
