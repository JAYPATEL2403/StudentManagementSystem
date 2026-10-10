
"use strict";

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function handleError(res, error, message) {
    console.error(message + ":", error.message);

    if (error.code === "23505") {
        return res.status(409).json({
            message: "This record already exists."
        });
    }

    if (error.code === "23503") {
        return res.status(409).json({
            message: "This record is linked to other records. Remove the linked records first."
        });
    }

    return res.status(500).json({ message });
}

function generatePassword() {
    return crypto.randomBytes(9).toString("base64url");
}

function calculateGrade(marks) {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    if (marks >= 40) return "D";
    return "F";
}

// HOME
app.get("/", (req, res) => {
    res.json({
        message: "Student Management System Backend is Running",
        database: "PostgreSQL"
    });
});

// GET ALL STUDENTS
app.get("/api/students", async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, "studentId", name, email, mobile, course, semester, username FROM students ORDER BY id DESC'
        );
        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Unable to load students");
    }
});

// GET ONE STUDENT
app.get("/api/students/:id", async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, "studentId", name, email, mobile, course, semester, username FROM students WHERE "studentId" = $1',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Unable to load student");
    }
});

// ADD STUDENT
app.post("/api/students", async (req, res) => {
    const { name, email, mobile, course, semester } = req.body;

    if (
        !name?.trim() ||
        !email?.trim() ||
        !course?.trim() ||
        semester === undefined ||
        semester === null ||
        semester === ""
    ) {
        return res.status(400).json({
            message: "Please provide name, email, course and semester."
        });
    }

    const semesterNumber = Number(semester);

    if (!Number.isInteger(semesterNumber) || semesterNumber < 1) {
        return res.status(400).json({
            message: "Semester must be a positive whole number."
        });
    }

    try {
        const last = await db.query(`
            SELECT "studentId"
            FROM students
            WHERE "studentId" ~ '^STU[0-9]+$'
            ORDER BY id DESC
            LIMIT 1
        `);

        let nextNumber = 1;

        if (last.rows.length > 0) {
            const previous = Number(
                last.rows[0].studentId.replace("STU", "")
            );

            if (Number.isFinite(previous)) {
                nextNumber = previous + 1;
            }
        }

        const studentId = "STU" + String(nextNumber).padStart(3, "0");
        const username = studentId;
        const temporaryPassword = generatePassword();
        const passwordHash = await bcrypt.hash(temporaryPassword, 10);

        const result = await db.query(
            `INSERT INTO students
                ("studentId", name, email, mobile, course, semester, username, "passwordHash")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id, "studentId", name, email, mobile, course, semester, username`,
            [
                studentId,
                name.trim(),
                email.trim(),
                mobile?.trim() || "",
                course.trim(),
                semesterNumber,
                username,
                passwordHash
            ]
        );

        res.status(201).json({
            message: "Student added successfully",
            student: result.rows[0],
            studentId,
            username,
            temporaryPassword
        });
    } catch (error) {
        handleError(res, error, "Unable to create student");
    }
});

// UPDATE STUDENT
app.put("/api/students/:id", async (req, res) => {
    const { name, email, mobile, course, semester } = req.body;

    if (
        !name?.trim() ||
        !email?.trim() ||
        !course?.trim() ||
        semester === undefined ||
        semester === null ||
        semester === ""
    ) {
        return res.status(400).json({
            message: "Please provide all required student details."
        });
    }

    const semesterNumber = Number(semester);

    if (!Number.isInteger(semesterNumber) || semesterNumber < 1) {
        return res.status(400).json({
            message: "Semester must be a positive whole number."
        });
    }

    try {
        const result = await db.query(
            `UPDATE students
             SET name = $1, email = $2, mobile = $3, course = $4, semester = $5
             WHERE "studentId" = $6
             RETURNING "studentId"`,
            [
                name.trim(),
                email.trim(),
                mobile?.trim() || "",
                course.trim(),
                semesterNumber,
                req.params.id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({
            message: "Student updated successfully",
            studentId: result.rows[0].studentId
        });
    } catch (error) {
        handleError(res, error, "Unable to update student");
    }
});

// DELETE STUDENT
app.delete("/api/students/:id", async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM students WHERE "studentId" = $1 RETURNING "studentId"',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        handleError(res, error, "Unable to delete student");
    }
});

// STUDENT LOGIN
app.post("/api/student/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    try {
        const result = await db.query(
            `SELECT id, "studentId", name, email, mobile, course, semester,
                    username, "passwordHash"
             FROM students
             WHERE username = $1 OR "studentId" = $1
             LIMIT 1`,
            [username]
        );

        const student = result.rows[0];

        if (
            !student ||
            !student.passwordHash ||
            !(await bcrypt.compare(password, student.passwordHash))
        ) {
            return res.status(401).json({
                message: "Invalid Student ID or password"
            });
        }

        const {
            passwordHash,
            ...safeStudent
        } = student;

        res.json({
            message: "Student login successful",
            student: safeStudent
        });
    } catch (error) {
        handleError(res, error, "Login failed");
    }
});

// ATTENDANCE TEST
app.get("/api/attendance-test", (req, res) => {
    res.json({ message: "Attendance API is working" });
});

// GET ALL ATTENDANCE
app.get("/api/attendance", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT a.id, a."studentId", s.name, a.date, a.status, a."createdAt"
            FROM attendance a
            LEFT JOIN students s ON a."studentId" = s."studentId"
            ORDER BY a.date DESC, a.id DESC
        `);

        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Unable to load attendance");
    }
});

// GET ATTENDANCE FOR ONE STUDENT
app.get("/api/attendance/student/:studentId", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT a.id, a."studentId", s.name, a.date, a.status, a."createdAt"
             FROM attendance a
             LEFT JOIN students s ON a."studentId" = s."studentId"
             WHERE a."studentId" = $1
             ORDER BY a.date DESC, a.id DESC`,
            [req.params.studentId]
        );

        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Unable to load student attendance");
    }
});

// ADD ATTENDANCE
app.post("/api/attendance", async (req, res) => {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
        return res.status(400).json({
            message: "Student ID, date and status are required"
        });
    }

    if (!["Present", "Absent"].includes(status)) {
        return res.status(400).json({
            message: "Status must be Present or Absent"
        });
    }

    try {
        const student = await db.query(
            'SELECT "studentId" FROM students WHERE "studentId" = $1',
            [studentId]
        );

        if (student.rowCount === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const existing = await db.query(
            'SELECT id FROM attendance WHERE "studentId" = $1 AND date = $2 LIMIT 1',
            [studentId, date]
        );

        if (existing.rowCount > 0) {
            return res.status(409).json({
                message: "Attendance already marked for this student on this date"
            });
        }

        const result = await db.query(
            `INSERT INTO attendance ("studentId", date, status)
             VALUES ($1, $2, $3)
             RETURNING id, "studentId", date, status`,
            [studentId, date, status]
        );

        res.status(201).json({
            message: "Attendance marked successfully",
            attendance: result.rows[0],
            attendanceId: result.rows[0].id
        });
    } catch (error) {
        handleError(res, error, "Unable to mark attendance");
    }
});

// DELETE ATTENDANCE
app.delete("/api/attendance/:id", async (req, res) => {
    try {
        const result = await db.query(
            "DELETE FROM attendance WHERE id = $1 RETURNING id",
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.json({ message: "Attendance deleted successfully" });
    } catch (error) {
        handleError(res, error, "Unable to delete attendance");
    }
});

// GET ALL RESULTS
app.get("/api/results", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.id, r."studentId", s.name AS "studentName",
                   r.subject, r.marks, r.grade, r."createdAt"
            FROM results r
            LEFT JOIN students s ON r."studentId" = s."studentId"
            ORDER BY r.id DESC
        `);

        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Unable to load results");
    }
});

// GET RESULTS FOR ONE STUDENT
app.get("/api/results/student/:studentId", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, "studentId", subject, marks, grade, "createdAt"
             FROM results
             WHERE "studentId" = $1
             ORDER BY id DESC`,
            [req.params.studentId]
        );

        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Unable to load student results");
    }
});

// ADD RESULT
app.post("/api/results", async (req, res) => {
    const { studentId, subject, marks } = req.body;

    if (
        !studentId ||
        !subject?.trim() ||
        marks === undefined ||
        marks === null ||
        marks === ""
    ) {
        return res.status(400).json({
            message: "Student ID, subject and marks are required"
        });
    }

    const numericMarks = Number(marks);

    if (
        !Number.isFinite(numericMarks) ||
        numericMarks < 0 ||
        numericMarks > 100
    ) {
        return res.status(400).json({
            message: "Marks must be between 0 and 100"
        });
    }

    try {
        const student = await db.query(
            'SELECT name FROM students WHERE "studentId" = $1',
            [studentId]
        );

        if (student.rowCount === 0) {
            return res.status(404).json({ message: "Student ID not found" });
        }

        const grade = calculateGrade(numericMarks);

        const result = await db.query(
            `INSERT INTO results ("studentId", subject, marks, grade)
             VALUES ($1, $2, $3, $4)
             RETURNING id, "studentId", subject, marks, grade, "createdAt"`,
            [studentId, subject.trim(), numericMarks, grade]
        );

        res.status(201).json({
            message: "Result added successfully",
            result: {
                ...result.rows[0],
                studentName: student.rows[0].name
            }
        });
    } catch (error) {
        handleError(res, error, "Unable to add result");
    }
});

// DELETE RESULT
app.delete("/api/results/:id", async (req, res) => {
    try {
        const result = await db.query(
            "DELETE FROM results WHERE id = $1 RETURNING id",
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Result not found" });
        }

        res.json({ message: "Result deleted successfully" });
    } catch (error) {
        handleError(res, error, "Unable to delete result");
    }
});

// START SERVER ONLY AFTER DATABASE INITIALIZATION
async function startServer() {
    try {
        await db.ready;

        await db.query("SELECT 1");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log("PostgreSQL database connected");
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
