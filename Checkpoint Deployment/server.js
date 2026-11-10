require("dotenv").config();

const path = require("node:path");
const express = require("express");
const mongoose = require("mongoose");
const Attendance = require("./models/Attendance");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "10kb" }));

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 });
});

app.get("/api/attendance", async (req, res) => {
  const date = req.query.date;
  if (!validDate(date)) {
    return res.status(400).json({ error: "A valid date is required (YYYY-MM-DD)." });
  }
  try {
    const records = await Attendance.find({ workDate: date }).sort({ checkIn: -1 });
    res.json(records);
  } catch (error) {
    console.error("Could not load attendance:", error);
    res.status(500).json({ error: "Could not load attendance." });
  }
});

app.get("/api/attendance/summary", async (req, res) => {
  const date = req.query.date;
  if (!validDate(date)) {
    return res.status(400).json({ error: "A valid date is required (YYYY-MM-DD)." });
  }
  const start = new Date(`${date}T00:00:00.000Z`);
  start.setUTCDate(start.getUTCDate() - 6);
  const startDate = start.toISOString().slice(0, 10);

  try {
    const records = await Attendance.find({
      workDate: { $gte: startDate, $lte: date },
    });
    const today = records.filter((record) => record.workDate === date);
    const days = new Map();
    for (let offset = 0; offset < 7; offset += 1) {
      const day = new Date(start);
      day.setUTCDate(start.getUTCDate() + offset);
      days.set(day.toISOString().slice(0, 10), new Set());
    }
    for (const record of records) {
      days.get(record.workDate)?.add(record.employeeKey);
    }

    res.json({
      employees: new Set(today.map((record) => record.employeeKey)).size,
      working: today.filter((record) => !record.checkOut).length,
      shifts: today.length,
      hours:
        Math.round(
          (today.reduce((sum, record) => sum + record.minutesWorked, 0) / 60) * 10
        ) / 10,
      week: [...days].map(([day, employees]) => ({
        date: day,
        employees: employees.size,
      })),
    });
  } catch (error) {
    console.error("Could not load attendance summary:", error);
    res.status(500).json({ error: "Could not load attendance summary." });
  }
});

app.post("/api/attendance/check-in", async (req, res) => {
  const { name, role = "", workDate } = req.body;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 100 ||
    typeof role !== "string" ||
    role.trim().length > 100 ||
    !validDate(workDate)
  ) {
    return res.status(400).json({ error: "Enter a name and a valid work date." });
  }

  try {
    const record = await Attendance.create({
      name: name.trim(),
      employeeKey: name.trim().toLocaleLowerCase(),
      role: role.trim(),
      workDate,
      checkIn: new Date(),
    });
    res.status(201).json(record);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "This employee is already checked in." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Could not check in employee:", error);
    res.status(500).json({ error: "Could not check in employee." });
  }
});

app.post("/api/attendance/:id/check-out", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid attendance record." });
  }
  try {
    const record = await Attendance.findOne({
      _id: req.params.id,
      checkOut: { $exists: false },
    });
    if (!record) {
      return res.status(404).json({ error: "Open attendance record not found." });
    }
    record.checkOut = new Date();
    record.minutesWorked = Math.max(
      1,
      Math.floor((record.checkOut - record.checkIn) / 60000)
    );
    await record.save();
    res.json(record);
  } catch (error) {
    console.error("Could not check out employee:", error);
    res.status(500).json({ error: "Could not check out employee." });
  }
});

const buildPath = path.join(__dirname, "dist");
app.use(express.static(buildPath));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(buildPath, "index.html"), (error) => {
    if (error) next();
  });
});

async function start() {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes("<")) {
    throw new Error("Set your MongoDB Atlas connection string in MONGO_URI in .env.");
  }
  await mongoose.connect(uri);
  app.listen(port, () => {
    console.log(`Attendance app listening on port ${port}.`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Could not start the attendance app:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
