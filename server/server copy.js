const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./database");

const app = express();

const PORT = process.env.PORT || 5000;


// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors());
app.use(express.json());


// =========================================================
// HOME
// =========================================================

app.get("/", (req, res) => {

    res.json({
        message: "Student Management System Backend is Running",
        database: "SQLite"
    });

});


// =========================================================
// STUDENT APIs
// =========================================================


// =========================================================
// GET ALL STUDENTS
// =========================================================

app.get("/api/students", (req, res) => {

    db.all(
        "SELECT * FROM students ORDER BY id DESC",
        [],
        (error, rows) => {

            if (error) {

                console.error(
                    "Get students error:",
                    error.message
                );

                return res.status(500).json({
                    message: "Unable to load students"
                });

            }

            res.json(rows);

        }
    );

});


// =========================================================
// GET ONE STUDENT
// =========================================================

app.get("/api/students/:id", (req, res) => {

    const studentId = req.params.id;

    db.get(
        "SELECT * FROM students WHERE studentId = ?",
        [studentId],
        (error, row) => {

            if (error) {

                console.error(
                    "Get student error:",
                    error.message
                );

                return res.status(500).json({
                    message: "Unable to load student"
                });

            }

            if (!row) {

                return res.status(404).json({
                    message: "Student not found"
                });

            }

            res.json(row);

        }
    );

});


// =========================================================
// ADD STUDENT
// =========================================================

app.post("/api/students", async (req, res) => {

    const {
        name,
        email,
        mobile,
        course,
        semester
    } = req.body;


    if (
        !name ||
        !email ||
        !course ||
        !semester
    ) {

        return res.status(400).json({
            message:
                "Please provide all required student details"
        });

    }


    db.get(
        `
        SELECT studentId
        FROM students
        WHERE studentId LIKE 'STU%'
        ORDER BY id DESC
        LIMIT 1
        `,
        [],
        async (error, lastStudent) => {

            if (error) {

                console.error(
                    "Student ID error:",
                    error.message
                );

                return res.status(500).json({
                    message:
                        "Unable to generate Student ID"
                });

            }


            let nextNumber = 1;


            if (
                lastStudent &&
                lastStudent.studentId
            ) {

                const lastNumber =
                    parseInt(
                        lastStudent.studentId.replace(
                            "STU",
                            ""
                        ),
                        10
                    );


                if (!isNaN(lastNumber)) {

                    nextNumber =
                        lastNumber + 1;

                }

            }


            const studentId =
                "STU" +
                String(nextNumber).padStart(
                    3,
                    "0"
                );


            const username =
                studentId;


            const characters =
                "ABCDEFGHJKLMNPQRSTUVWXYZ" +
                "abcdefghijkmnopqrstuvwxyz" +
                "23456789@#$";


            let temporaryPassword = "";


            for (
                let i = 0;
                i < 10;
                i++
            ) {

                const randomIndex =
                    Math.floor(
                        Math.random() *
                        characters.length
                    );

                temporaryPassword +=
                    characters[randomIndex];

            }


            try {

                const passwordHash =
                    await bcrypt.hash(
                        temporaryPassword,
                        10
                    );


                const sql = `
                    INSERT INTO students
                    (
                        studentId,
                        name,
                        email,
                        mobile,
                        course,
                        semester,
                        username,
                        passwordHash
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;


                db.run(
                    sql,
                    [
                        studentId,
                        name,
                        email,
                        mobile || "",
                        course,
                        semester,
                        username,
                        passwordHash
                    ],
                    function (insertError) {

                        if (insertError) {

                            console.error(
                                "Add student error:",
                                insertError.message
                            );

                            return res.status(400).json({
                                message:
                                    insertError.message
                            });

                        }


                        res.status(201).json({

                            message:
                                "Student added successfully",

                            studentId:
                                studentId,

                            username:
                                username,

                            temporaryPassword:
                                temporaryPassword

                        });

                    }
                );

            }
            catch (error) {

                console.error(
                    "Student creation error:",
                    error.message
                );

                res.status(500).json({
                    message:
                        "Unable to create student"
                });

            }

        }
    );

});


// =========================================================
// UPDATE STUDENT
// =========================================================

app.put("/api/students/:id", (req, res) => {

    const studentId =
        req.params.id;


    const {
        name,
        email,
        mobile,
        course,
        semester
    } = req.body;


    if (
        !name ||
        !email ||
        !course ||
        !semester
    ) {

        return res.status(400).json({
            message:
                "Please provide all required student details"
        });

    }


    const sql = `
        UPDATE students
        SET
            name = ?,
            email = ?,
            mobile = ?,
            course = ?,
            semester = ?
        WHERE studentId = ?
    `;


    db.run(
        sql,
        [
            name,
            email,
            mobile || "",
            course,
            semester,
            studentId
        ],
        function (error) {

            if (error) {

                console.error(
                    "Update student error:",
                    error.message
                );

                return res.status(500).json({
                    message:
                        error.message
                });

            }


            if (this.changes === 0) {

                return res.status(404).json({
                    message:
                        "Student not found"
                });

            }


            res.json({
                message:
                    "Student updated successfully",
                studentId:
                    studentId
            });

        }
    );

});


// =========================================================
// DELETE STUDENT
// =========================================================

app.delete("/api/students/:id", (req, res) => {

    const studentId =
        req.params.id;


    db.run(
        "DELETE FROM students WHERE studentId = ?",
        [studentId],
        function (error) {

            if (error) {

                console.error(
                    "Delete student error:",
                    error.message
                );

                return res.status(500).json({
                    message:
                        error.message
                });

            }


            if (this.changes === 0) {

                return res.status(404).json({
                    message:
                        "Student not found"
                });

            }


            res.json({
                message:
                    "Student deleted successfully"
            });

        }
    );

});


// =========================================================
// STUDENT LOGIN
// =========================================================

app.post("/api/student/login", (req, res) => {

    const {
        username,
        password
    } = req.body;


    if (!username || !password) {

        return res.status(400).json({
            message:
                "Username and password are required"
        });

    }


    const sql = `
        SELECT
            id,
            studentId,
            name,
            email,
            mobile,
            course,
            semester,
            username,
            passwordHash
        FROM students
        WHERE username = ?
           OR studentId = ?
        LIMIT 1
    `;


    db.get(
        sql,
        [username, username],
        async (error, student) => {

            if (error) {

                console.error(
                    "Student login error:",
                    error.message
                );

                return res.status(500).json({
                    message:
                        "Login failed"
                });

            }


            if (!student) {

                return res.status(401).json({
                    message:
                        "Invalid Student ID or password"
                });

            }


            try {

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        student.passwordHash
                    );


                if (!passwordMatch) {

                    return res.status(401).json({
                        message:
                            "Invalid Student ID or password"
                    });

                }


                res.json({

                    message:
                        "Student login successful",

                    student: {

                        id:
                            student.id,

                        studentId:
                            student.studentId,

                        name:
                            student.name,

                        email:
                            student.email,

                        mobile:
                            student.mobile,

                        course:
                            student.course,

                        semester:
                            student.semester,

                        username:
                            student.username

                    }

                });

            }
            catch (passwordError) {

                console.error(
                    "Password verification error:",
                    passwordError.message
                );

                res.status(500).json({
                    message:
                        "Unable to verify password"
                });

            }

        }
    );

});


// =========================================================
// ATTENDANCE APIs
// =========================================================


// =========================================================
// ATTENDANCE TEST
// =========================================================

app.get("/api/attendance-test", (req, res) => {

    res.json({
        message:
            "Attendance API is working"
    });

});


// =========================================================
// GET ALL ATTENDANCE
// =========================================================

app.get("/api/attendance", (req, res) => {

    const sql = `
        SELECT
            attendance.id,
            attendance.studentId,
            students.name,
            attendance.date,
            attendance.status,
            attendance.createdAt
        FROM attendance
        LEFT JOIN students
            ON attendance.studentId =
               students.studentId
        ORDER BY
            attendance.date DESC,
            attendance.id DESC
    `;


    db.all(
        sql,
        [],
        (error, rows) => {

            if (error) {

                console.error(
                    "Get attendance error:",
                    error.message
                );

                return res.status(500).json({
                    message:
                        error.message
                });

            }


            res.json(rows);

        }
    );

});


// =========================================================
// GET STUDENT ATTENDANCE
// =========================================================

app.get(
    "/api/attendance/student/:studentId",
    (req, res) => {

        const studentId =
            req.params.studentId;


        const sql = `
            SELECT
                attendance.id,
                attendance.studentId,
                students.name,
                attendance.date,
                attendance.status,
                attendance.createdAt
            FROM attendance
            LEFT JOIN students
                ON attendance.studentId =
                   students.studentId
            WHERE attendance.studentId = ?
            ORDER BY
                attendance.date DESC,
                attendance.id DESC
        `;


        db.all(
            sql,
            [studentId],
            (error, rows) => {

                if (error) {

                    console.error(
                        "Get student attendance error:",
                        error.message
                    );

                    return res.status(500).json({
                        message:
                            error.message
                    });

                }


                res.json(rows);

            }
        );

    }
);


// =========================================================
// ADD ATTENDANCE
// =========================================================

app.post("/api/attendance", (req, res) => {

    const {
        studentId,
        date,
        status
    } = req.body;


    if (
        !studentId ||
        !date ||
        !status
    ) {

        return res.status(400).json({
            message:
                "Student ID, date and status are required"
        });

    }


    if (
        status !== "Present" &&
        status !== "Absent"
    ) {

        return res.status(400).json({
            message:
                "Status must be Present or Absent"
        });

    }


    db.get(
        "SELECT * FROM students WHERE studentId = ?",
        [studentId],
        (studentError, student) => {

            if (studentError) {

                return res.status(500).json({
                    message:
                        studentError.message
                });

            }


            if (!student) {

                return res.status(404).json({
                    message:
                        "Student not found"
                });

            }


            db.get(
                `
                SELECT *
                FROM attendance
                WHERE studentId = ?
                AND date = ?
                `,
                [
                    studentId,
                    date
                ],
                (duplicateError, existing) => {

                    if (duplicateError) {

                        return res.status(500).json({
                            message:
                                duplicateError.message
                        });

                    }


                    if (existing) {

                        return res.status(400).json({
                            message:
                                "Attendance already marked for this student on this date"
                        });

                    }


                    db.run(
                        `
                        INSERT INTO attendance
                        (
                            studentId,
                            date,
                            status
                        )
                        VALUES (?, ?, ?)
                        `,
                        [
                            studentId,
                            date,
                            status
                        ],
                        function (insertError) {

                            if (insertError) {

                                return res.status(500).json({
                                    message:
                                        insertError.message
                                });

                            }


                            res.status(201).json({

                                message:
                                    "Attendance marked successfully",

                                attendanceId:
                                    this.lastID,

                                studentId:
                                    studentId,

                                date:
                                    date,

                                status:
                                    status

                            });

                        }
                    );

                }
            );

        }
    );

});


// =========================================================
// DELETE ATTENDANCE
// =========================================================

app.delete(
    "/api/attendance/:id",
    (req, res) => {

        const attendanceId =
            req.params.id;


        db.run(
            `
            DELETE FROM attendance
            WHERE id = ?
            `,
            [attendanceId],
            function (error) {

                if (error) {

                    return res.status(500).json({
                        message:
                            error.message
                    });

                }


                if (this.changes === 0) {

                    return res.status(404).json({
                        message:
                            "Attendance record not found"
                    });

                }


                res.json({
                    message:
                        "Attendance deleted successfully"
                });

            }
        );

    }
);


// =========================================================
// RESULT APIs
// =========================================================


// =========================================================
// GET ALL RESULTS - ADMIN
// =========================================================

app.get("/api/results", (req, res) => {

    const sql = `
        SELECT
            results.id,
            results.studentId,
            students.name AS studentName,
            results.subject,
            results.marks,
            results.grade,
            results.createdAt
        FROM results
        LEFT JOIN students
            ON results.studentId =
               students.studentId
        ORDER BY
            results.id DESC
    `;


    db.all(
        sql,
        [],
        (error, rows) => {

            if (error) {

                console.error(
                    "Get results error:",
                    error.message
                );

                return res.status(500).json({
                    message:
                        "Unable to load results"
                });

            }


            res.json(rows);

        }
    );

});


// =========================================================
// GET RESULTS FOR ONE STUDENT
// =========================================================

app.get(
    "/api/results/student/:studentId",
    (req, res) => {

        const studentId =
            req.params.studentId;


        const sql = `
            SELECT
                id,
                studentId,
                subject,
                marks,
                grade,
                createdAt
            FROM results
            WHERE studentId = ?
            ORDER BY id DESC
        `;


        db.all(
            sql,
            [studentId],
            (error, rows) => {

                if (error) {

                    console.error(
                        "Get student results error:",
                        error.message
                    );

                    return res.status(500).json({
                        message:
                            "Unable to load student results"
                    });

                }


                res.json(rows);

            }
        );

    }
);


// =========================================================
// ADD RESULT
// =========================================================

app.post("/api/results", (req, res) => {

    const {
        studentId,
        subject,
        marks
    } = req.body;


    console.log(
        "Add Result Request:",
        req.body
    );


    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    if (
        !studentId ||
        !subject ||
        marks === undefined ||
        marks === null ||
        marks === ""
    ) {

        return res.status(400).json({
            message:
                "Student ID, subject and marks are required"
        });

    }


    const numericMarks =
        Number(marks);


    if (
        Number.isNaN(numericMarks) ||
        numericMarks < 0 ||
        numericMarks > 100
    ) {

        return res.status(400).json({
            message:
                "Marks must be between 0 and 100"
        });

    }


    // ---------------------------------------------------------
    // CHECK STUDENT
    // ---------------------------------------------------------

    db.get(
        `
        SELECT
            studentId,
            name
        FROM students
        WHERE studentId = ?
        `,
        [studentId],
        (studentError, student) => {

            if (studentError) {

                console.error(
                    "Result student check error:",
                    studentError.message
                );

                return res.status(500).json({
                    message:
                        "Unable to verify student"
                });

            }


            if (!student) {

                return res.status(404).json({
                    message:
                        "Student ID not found"
                });

            }


            // ---------------------------------------------------------
            // CALCULATE GRADE
            // ---------------------------------------------------------

            let grade;


            if (numericMarks >= 90) {

                grade = "A+";

            }
            else if (numericMarks >= 80) {

                grade = "A";

            }
            else if (numericMarks >= 70) {

                grade = "B+";

            }
            else if (numericMarks >= 60) {

                grade = "B";

            }
            else if (numericMarks >= 50) {

                grade = "C";

            }
            else if (numericMarks >= 40) {

                grade = "D";

            }
            else {

                grade = "F";

            }


            // ---------------------------------------------------------
            // INSERT RESULT
            // ---------------------------------------------------------

            const sql = `
                INSERT INTO results
                (
                    studentId,
                    subject,
                    marks,
                    grade
                )
                VALUES (?, ?, ?, ?)
            `;


            db.run(
                sql,
                [
                    studentId,
                    subject.trim(),
                    numericMarks,
                    grade
                ],
                function (insertError) {

                    if (insertError) {

                        console.error(
                            "Add result database error:",
                            insertError.message
                        );

                        return res.status(500).json({
                            message:
                                "Unable to add result"
                        });

                    }


                    console.log(
                        "Result added successfully:",
                        this.lastID
                    );


                    // ---------------------------------------------------------
                    // SUCCESS JSON RESPONSE
                    // ---------------------------------------------------------

                    res.status(201).json({

                        message:
                            "Result added successfully",

                        result: {

                            id:
                                this.lastID,

                            studentId:
                                studentId,

                            studentName:
                                student.name,

                            subject:
                                subject.trim(),

                            marks:
                                numericMarks,

                            grade:
                                grade

                        }

                    });

                }
            );

        }
    );

});


// =========================================================
// DELETE RESULT
// =========================================================

app.delete(
    "/api/results/:id",
    (req, res) => {

        const resultId =
            req.params.id;


        db.run(
            `
            DELETE FROM results
            WHERE id = ?
            `,
            [resultId],
            function (error) {

                if (error) {

                    console.error(
                        "Delete result error:",
                        error.message
                    );

                    return res.status(500).json({
                        message:
                            "Unable to delete result"
                    });

                }


                if (this.changes === 0) {

                    return res.status(404).json({
                        message:
                            "Result not found"
                    });

                }


                res.json({
                    message:
                        "Result deleted successfully"
                });

            }
        );

    }
);


// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});