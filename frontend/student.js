"use strict";

/* ==========================================
   API
========================================== */

const API_BASE_URL = "http://localhost:5000";


/* ==========================================
   STUDENT LOGIN CHECK
========================================== */

const role = localStorage.getItem("userRole");
const loggedInStudentId = localStorage.getItem("studentId");

if (role !== "student" || !loggedInStudentId) {
    window.location.replace("login.html");
}


/* ==========================================
   STUDENT ID
========================================== */

const studentId = loggedInStudentId;

document.querySelectorAll(".student-id").forEach(function (element) {
    element.textContent = studentId || "--";
});


/* ==========================================
   NAVIGATION
========================================== */

const navLinks =
    document.querySelectorAll(".nav-link");

const sections =
    document.querySelectorAll(".student-section");


function openSection(sectionId) {

    sections.forEach(function (section) {
        section.classList.remove("active");
    });

    navLinks.forEach(function (link) {
        link.classList.remove("active");
    });

    const target =
        document.getElementById(sectionId);

    const targetLink =
        document.querySelector(
            '.nav-link[href="#' + sectionId + '"]'
        );

    if (target) {
        target.classList.add("active");

        window.scrollTo({
            top: target.offsetTop - 30,
            behavior: "smooth"
        });
    }

    if (targetLink) {
        targetLink.classList.add("active");
    }
}


/* ==========================================
   NAVIGATION CLICK
========================================== */

navLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }

        const sectionId =
            href.replace("#", "");

        openSection(sectionId);

        const sidebar =
            document.getElementById(
                "studentSidebar"
            );

        if (sidebar) {
            sidebar.classList.remove("show");
        }

    });

});


/* ==========================================
   QUICK ACTION BUTTONS
========================================== */

const profileBtn =
    document.getElementById("profileBtn");

if (profileBtn) {

    profileBtn.addEventListener(
        "click",
        function () {
            openSection("profile");
        }
    );

}


const viewAttendanceBtn =
    document.getElementById(
        "viewAttendanceBtn"
    );

if (viewAttendanceBtn) {

    viewAttendanceBtn.addEventListener(
        "click",
        function () {
            openSection("attendance");
        }
    );

}


const viewResultBtn =
    document.getElementById(
        "viewResultBtn"
    );

if (viewResultBtn) {

    viewResultBtn.addEventListener(
        "click",
        function () {
            openSection("results");
        }
    );

}


const coursesBtn =
    document.getElementById(
        "coursesBtn"
    );

if (coursesBtn) {

    coursesBtn.addEventListener(
        "click",
        function () {
            openSection("courses");
        }
    );

}


/* ==========================================
   CREATE INITIALS
========================================== */

function setInitials(elementId, name) {

    const element =
        document.getElementById(elementId);

    if (!element || !name) {
        return;
    }

    const nameParts =
        String(name)
            .trim()
            .split(/\s+/);

    let initials = "";

    if (nameParts.length >= 2) {

        initials =
            nameParts[0].charAt(0) +
            nameParts[nameParts.length - 1]
                .charAt(0);

    } else {

        initials =
            nameParts[0]
                .substring(0, 2);

    }

    element.textContent =
        initials.toUpperCase();
}


/* ==========================================
   LOAD STUDENT PROFILE
========================================== */

async function loadStudentProfile() {

    const currentStudentId =
        localStorage.getItem("studentId");

    if (!currentStudentId) {

        console.error(
            "Student ID not found."
        );

        return;
    }

    try {

        console.log(
            "Loading student profile:",
            currentStudentId
        );

        const response =
            await fetch(
                `${API_BASE_URL}/api/students/${encodeURIComponent(currentStudentId)}`
            );

        if (!response.ok) {

            throw new Error(
                "Student profile API returned " +
                response.status
            );

        }

        const student =
            await response.json();

        console.log(
            "Student profile loaded:",
            student
        );


        /* =====================================
           NAME
        ===================================== */

        const sidebarName =
            document.getElementById(
                "sidebarStudentName"
            );

        const dashboardName =
            document.getElementById(
                "dashboardStudentName"
            );

      const profileName =
    document.getElementById(
        "profileName"
    );

const profileFullName =
    document.getElementById(
        "profileFullName"
    );


        if (sidebarName) {
            sidebarName.textContent =
                student.name || "Student";
        }

        if (dashboardName) {
            dashboardName.textContent =
                student.name || "Student";
        }

      if (profileName) {
    profileName.textContent =
        student.name || "Student";
}

if (profileFullName) {
    profileFullName.textContent =
        student.name || "Student";
}

        /* =====================================
           STUDENT ID
        ===================================== */

        document
            .querySelectorAll(".student-id")
            .forEach(function (element) {

                element.textContent =
                    student.studentId ||
                    currentStudentId;

            });


        const profileStudentId =
            document.getElementById(
                "profileStudentId"
            );

        const profileId =
            document.getElementById(
                "profileId"
            );


        if (profileStudentId) {

            profileStudentId.textContent =
                student.studentId ||
                currentStudentId;

        }

        if (profileId) {

            profileId.textContent =
                student.studentId ||
                currentStudentId;

        }


        /* =====================================
           EMAIL
        ===================================== */

        const profileEmail =
            document.getElementById(
                "profileEmail"
            );

        if (profileEmail) {

            profileEmail.textContent =
                student.email || "--";

        }


        /* =====================================
           MOBILE
        ===================================== */

        const profileMobile =
            document.getElementById(
                "profileMobile"
            );

        if (profileMobile) {

            profileMobile.textContent =
                student.mobile || "--";

        }


        /* =====================================
           COURSE
        ===================================== */

        const profileCourse =
            document.getElementById(
                "profileCourse"
            );

        const dashboardCourse =
            document.getElementById(
                "dashboardCourse"
            );


        const course =
            student.course ||
            student.branch ||
            "--";


        if (profileCourse) {
            profileCourse.textContent =
                course;
        }

        if (dashboardCourse) {
            dashboardCourse.textContent =
                course;
        }


        /* =====================================
           SEMESTER
        ===================================== */

        const profileSemester =
            document.getElementById(
                "profileSemester"
            );

        const dashboardSemester =
            document.getElementById(
                "dashboardSemester"
            );


        if (profileSemester) {

            profileSemester.textContent =
                student.semester || "--";

        }


        if (dashboardSemester) {

            dashboardSemester.textContent =
                student.semester
                    ? "Semester " +
                      student.semester
                    : "--";

        }


        /* =====================================
           AVATARS
        ===================================== */

        setInitials(
            "sidebarProfileAvatar",
            student.name
        );

        setInitials(
            "dashboardAvatar",
            student.name
        );

        setInitials(
            "profileAvatar",
            student.name
        );


        /* =====================================
           SAVE STUDENT DATA
        ===================================== */

        localStorage.setItem(
            "studentData",
            JSON.stringify(student)
        );


        console.log(
            "Student profile displayed successfully."
        );

    }
    catch (error) {

        console.error(
            "Student profile error:",
            error
        );

        const sidebarName =
            document.getElementById(
                "sidebarStudentName"
            );

        const dashboardName =
            document.getElementById(
                "dashboardStudentName"
            );

        const profileName =
            document.getElementById(
                "profileName"
            );


        if (sidebarName) {
            sidebarName.textContent =
                "Student";
        }

        if (dashboardName) {
            dashboardName.textContent =
                "Student";
        }

        if (profileName) {
            profileName.textContent =
                "Student";
        }

    }

}


/* ==========================================
   GET ATTENDANCE
========================================== */

async function getStudentAttendance() {

    if (!studentId) {
        return [];
    }

    const response =
        await fetch(
            `${API_BASE_URL}/api/attendance/student/${encodeURIComponent(studentId)}`
        );

    if (!response.ok) {

        throw new Error(
            "Unable to load attendance"
        );

    }

    const data =
        await response.json();

    return Array.isArray(data)
        ? data
        : [];

}


/* ==========================================
   CALCULATE ATTENDANCE
========================================== */

function calculateAttendance(attendance) {

    if (
        !attendance ||
        attendance.length === 0
    ) {

        return {
            total: 0,
            present: 0,
            percentage: 0
        };

    }


    const total =
        attendance.length;


    const present =
        attendance.filter(
            function (record) {

                return String(
                    record.status || ""
                ).toLowerCase() ===
                    "present";

            }
        ).length;


    const percentage =
        Math.round(
            (present / total) * 100
        );


    return {
        total: total,
        present: present,
        percentage: percentage
    };

}


/* ==========================================
   LOAD STUDENT ATTENDANCE
========================================== */

async function loadStudentAttendance() {

    const tableBody =
        document.getElementById(
            "studentAttendanceTableBody"
        );

    const percentageElement =
        document.getElementById(
            "studentAttendancePercentage"
        );

    const messageElement =
        document.getElementById(
            "attendanceMessage"
        );

    const descriptionElement =
        document.getElementById(
            "attendanceDescription"
        );

    const attendanceCircle =
        document.querySelector(
            ".attendance-circle"
        );


    if (!tableBody) {
        console.warn(
            "Attendance table not found."
        );
        return;
    }


    try {

        const attendance =
            await getStudentAttendance();

        const summary =
            calculateAttendance(
                attendance
            );


        /* =====================================
           ATTENDANCE CIRCLE
        ===================================== */

        if (attendanceCircle) {

            attendanceCircle.style.setProperty(
                "--attendance",
                summary.percentage + "%"
            );

        }


        /* =====================================
           NO ATTENDANCE
        ===================================== */

        if (attendance.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="2">
                        No attendance records found.
                    </td>
                </tr>
            `;


            if (percentageElement) {

                percentageElement.textContent =
                    "0%";

            }


            if (messageElement) {

                messageElement.textContent =
                    "No Attendance Data";

            }


            if (descriptionElement) {

                descriptionElement.textContent =
                    "Your attendance records will appear here when attendance is marked.";

            }


            return;
        }


        /* =====================================
           SUMMARY
        ===================================== */

        if (percentageElement) {

            percentageElement.textContent =
                summary.percentage + "%";

        }


        if (messageElement) {

            messageElement.textContent =
                summary.percentage >= 75
                    ? "Good Attendance"
                    : "Attendance Warning";

        }


        if (descriptionElement) {

            descriptionElement.textContent =
                `You have attended ${summary.present} out of ${summary.total} classes.`;

        }


        /* =====================================
           TABLE
        ===================================== */

        tableBody.innerHTML = "";


        attendance.forEach(
            function (record) {

                const row =
                    document.createElement("tr");


                const dateCell =
                    document.createElement("td");


                const statusCell =
                    document.createElement("td");


                dateCell.textContent =
                    record.date || "--";


                const statusBadge =
                    document.createElement("span");


                statusBadge.classList.add(
                    "badge"
                );


                const status =
                    String(
                        record.status || ""
                    ).toLowerCase();


                if (status === "present") {

                    statusBadge.classList.add(
                        "success"
                    );

                } else {

                    statusBadge.classList.add(
                        "warning"
                    );

                }


                statusBadge.textContent =
                    record.status || "--";


                statusCell.appendChild(
                    statusBadge
                );


                row.appendChild(
                    dateCell
                );

                row.appendChild(
                    statusCell
                );


                tableBody.appendChild(
                    row
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Attendance loading error:",
            error
        );


        tableBody.innerHTML = `
            <tr>
                <td colspan="2">
                    Unable to load attendance.
                </td>
            </tr>
        `;

    }

}


/* ==========================================
   DASHBOARD ATTENDANCE
========================================== */

async function loadDashboardAttendance() {

    const attendanceElement =
        document.getElementById(
            "dashboardAttendance"
        );

    const attendanceTextElement =
        document.getElementById(
            "dashboardAttendanceText"
        );


    try {

        const attendance =
            await getStudentAttendance();

        const summary =
            calculateAttendance(
                attendance
            );


        if (attendanceElement) {

            attendanceElement.textContent =
                summary.percentage + "%";

        }


        if (attendanceTextElement) {

            if (summary.total === 0) {

                attendanceTextElement.textContent =
                    "No attendance records";

            }
            else if (
                summary.percentage >= 75
            ) {

                attendanceTextElement.textContent =
                    "Good attendance";

            }
            else {

                attendanceTextElement.textContent =
                    "Attendance needs improvement";

            }

        }

    }
    catch (error) {

        console.error(
            "Dashboard attendance error:",
            error
        );

        if (attendanceElement) {
            attendanceElement.textContent =
                "0%";
        }

        if (attendanceTextElement) {
            attendanceTextElement.textContent =
                "Unable to load attendance";
        }

    }

}


/* ==========================================
   CALCULATE RESULT SUMMARY
========================================== */

function calculateResultSummary(results) {

    if (
        !results ||
        results.length === 0
    ) {

        return {
            total: 0,
            average: 0,
            grade: "--",
            passed: 0,
            failed: 0
        };

    }


    let totalMarks = 0;


    results.forEach(
        function (result) {

            totalMarks +=
                Number(result.marks) || 0;

        }
    );


    const average =
        totalMarks / results.length;


    let grade = "F";


    if (average >= 90) {

        grade = "A+";

    }
    else if (average >= 80) {

        grade = "A";

    }
    else if (average >= 70) {

        grade = "B+";

    }
    else if (average >= 60) {

        grade = "B";

    }
    else if (average >= 50) {

        grade = "C";

    }
    else if (average >= 40) {

        grade = "D";

    }


    const passed =
        results.filter(
            function (result) {

                return (
                    Number(result.marks) >= 40
                );

            }
        ).length;


    const failed =
        results.length - passed;


    return {
        total: results.length,
        average: average,
        grade: grade,
        passed: passed,
        failed: failed
    };

}


/* ==========================================
   LOAD STUDENT RESULTS
========================================== */

async function loadStudentResults() {

    const currentStudentId =
        localStorage.getItem(
            "studentId"
        );


    const tableBody =
        document.getElementById(
            "studentResultsTableBody"
        );


    const averageMarksElement =
        document.getElementById(
            "studentResultCGPA"
        );


    const gradeElement =
        document.getElementById(
            "studentResultGrade"
        );


    const semesterElement =
        document.getElementById(
            "studentResultSemester"
        );


    if (!currentStudentId) {

        console.error(
            "Student ID not found."
        );

        return;
    }


    try {

        console.log(
            "Loading results for:",
            currentStudentId
        );


        const response =
            await fetch(
                `${API_BASE_URL}/api/results/student/${encodeURIComponent(currentStudentId)}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load student results. Status: " +
                response.status
            );

        }


        const results =
            await response.json();


        console.log(
            "Student results:",
            results
        );


        /* =====================================
           NO RESULTS
        ===================================== */

        if (
            !Array.isArray(results) ||
            results.length === 0
        ) {

            if (tableBody) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4"
                            class="table-empty">
                            No results available yet.
                        </td>
                    </tr>
                `;

            }


            if (averageMarksElement) {

                averageMarksElement.textContent =
                    "0%";

            }


            if (gradeElement) {

                gradeElement.textContent =
                    "N/A";

            }


            if (semesterElement) {

                semesterElement.textContent =
                    "No Result";

            }


            return;
        }


        /* =====================================
           RESULT SUMMARY
        ===================================== */

        const summary =
            calculateResultSummary(
                results
            );


        /* =====================================
           UPDATE RESULT SUMMARY
        ===================================== */

        if (averageMarksElement) {

            averageMarksElement.textContent =
                summary.average.toFixed(1) +
                "%";

        }


        if (gradeElement) {

            gradeElement.textContent =
                summary.grade;

        }


        if (semesterElement) {

            semesterElement.textContent =
                "Current Semester";

        }


        /* =====================================
           UPDATE RESULT TABLE
        ===================================== */

        if (tableBody) {

            tableBody.innerHTML = "";


            results.forEach(
                function (result) {

                    const marks =
                        Number(result.marks) || 0;


                    const passed =
                        marks >= 40;


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `
                        <td>
                            ${result.subject || "-"}
                        </td>

                        <td>
                            ${marks}/100
                        </td>

                        <td>
                            <span class="grade-badge">
                                ${result.grade || "-"}
                            </span>
                        </td>

                        <td>
                            <span class="${
                                passed
                                    ? "result-pass"
                                    : "result-fail"
                            }">
                                ${
                                    passed
                                        ? "PASS"
                                        : "FAIL"
                                }
                            </span>
                        </td>
                    `;


                    tableBody.appendChild(
                        row
                    );

                }
            );

        }


        /* =====================================
           UPDATE DASHBOARD GRADE
        ===================================== */

        const dashboardCards =
            document.querySelectorAll(
                ".stat-card"
            );


        if (
            dashboardCards.length >= 2
        ) {

            const gradeCard =
                dashboardCards[1];


            const heading =
                gradeCard.querySelector(
                    "h2, h3"
                );


            const small =
                gradeCard.querySelector(
                    "small"
                );


            if (heading) {

                heading.textContent =
                    summary.grade;

            }


            if (small) {

                small.textContent =
                    "Overall Grade";

            }

        }


        /* =====================================
           UPDATE DASHBOARD AVERAGE
        ===================================== */

        if (
            dashboardCards.length >= 3
        ) {

            const averageCard =
                dashboardCards[2];


            const heading =
                averageCard.querySelector(
                    "h2, h3"
                );


            if (heading) {

                heading.textContent =
                    summary.average.toFixed(1) +
                    "%";

            }

        }


        /* =====================================
           UPDATE RECENT ACTIVITY
        ===================================== */

        const activityList =
            document.querySelector(
                ".activity-list"
            );


        if (activityList) {

            const firstActivity =
                activityList.querySelector(
                    ".activity"
                );


            if (firstActivity) {

                const title =
                    firstActivity.querySelector(
                        "strong"
                    );


                const description =
                    firstActivity.querySelector(
                        "p"
                    );


                const latestResult =
                    results[0];


                if (title) {

                    title.textContent =
                        "Result Published";

                }


                if (description) {

                    description.textContent =
                        `${latestResult.subject || "Subject"} result: ${latestResult.marks}/100 (${latestResult.grade || "-"})`;

                }

            }

        }


        console.log(
            "Student results displayed successfully."
        );

    }
    catch (error) {

        console.error(
            "Student results loading error:",
            error
        );


        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="4"
                        class="table-empty">
                        Unable to load results.
                    </td>
                </tr>
            `;

        }

    }

}


/* ==========================================
   MOBILE MENU
========================================== */

const menuBtn =
    document.getElementById(
        "menuBtn"
    );

const sidebar =
    document.getElementById(
        "studentSidebar"
    );


if (menuBtn && sidebar) {

    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "show"
            );

        }
    );

}


/* ==========================================
   LOGOUT
========================================== */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            const confirmation =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmation) {
                return;
            }


            localStorage.removeItem(
                "userRole"
            );

            localStorage.removeItem(
                "studentId"
            );

            localStorage.removeItem(
                "studentData"
            );


            window.location.replace(
                "login.html"
            );

        }
    );

}


/* ==========================================
   KEYBOARD SHORTCUT
========================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            if (sidebar) {

                sidebar.classList.remove(
                    "show"
                );

            }

        }

    }
);


/* ==========================================
   START DASHBOARD
========================================== */

async function initializeStudentDashboard() {

    console.log(
        "Starting Student Dashboard..."
    );


    /*
       Each function has its own error handling,
       so one failed API will not stop the
       remaining dashboard sections.
    */

    await loadStudentProfile();

    await loadDashboardAttendance();

    await loadStudentAttendance();

    await loadStudentResults();


    console.log(
        "Student Dashboard loaded successfully."
    );

}


/* ==========================================
   START
========================================== */

initializeStudentDashboard();