const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
    "./students.db",
    (error) => {
        if (error) {
            console.error(
                "Database connection failed:",
                error.message
            );
        } else {
            console.log(
                "SQLite database connected successfully"
            );
        }
    }
);


// ==========================================
// STUDENTS TABLE
// ==========================================

db.run(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        mobile TEXT,
        course TEXT NOT NULL,
        semester INTEGER NOT NULL,
        username TEXT UNIQUE,
        passwordHash TEXT
    )
`, (error) => {

    if (error) {

        console.error(
            "Students table error:",
            error.message
        );

    } else {

        console.log(
            "Students table ready"
        );

        // ==========================================
        // ADD LOGIN COLUMNS TO OLD DATABASE
        // ==========================================

        db.run(
            `ALTER TABLE students
             ADD COLUMN username TEXT`,
            (alterError) => {

                if (
                    alterError &&
                    !alterError.message.includes(
                        "duplicate column name"
                    )
                ) {

                    console.log(
                        "Username column:",
                        alterError.message
                    );

                }

            }
        );

        db.run(
            `ALTER TABLE students
             ADD COLUMN passwordHash TEXT`,
            (alterError) => {

                if (
                    alterError &&
                    !alterError.message.includes(
                        "duplicate column name"
                    )
                ) {

                    console.log(
                        "Password column:",
                        alterError.message
                    );

                }

            }
        );

    }
});


// ==========================================
// ATTENDANCE TABLE
// ==========================================

db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (studentId)
        REFERENCES students(studentId)
    )
`, (error) => {

    if (error) {

        console.error(
            "Attendance table error:",
            error.message
        );

    } else {

        console.log(
            "Attendance table ready"
        );

    }
});


module.exports = db;
// ==========================================
// RESULTS TABLE
// ==========================================

db.run(`
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId TEXT NOT NULL,
        subject TEXT NOT NULL,
        marks INTEGER NOT NULL,
        grade TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (error) => {

    if (error) {
        console.error(
            "Results table error:",
            error.message
        );
    } else {
        console.log(
            "Results table ready"
        );
    }

});