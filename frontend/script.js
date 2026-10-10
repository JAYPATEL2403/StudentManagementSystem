"use strict";

/* =========================================================
   ADMIN DASHBOARD SCRIPT
========================================================= */


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL =
    "http://localhost:5000/api/students";

const ATTENDANCE_API_URL =
    "http://localhost:5000/api/attendance";


/* =========================================================
   ADMIN LOGIN PROTECTION
========================================================= */

const userRole =
    localStorage.getItem("userRole");

if (userRole !== "admin") {

    window.location.replace("login.html");

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeAdminDashboard();

    }
);


/* =========================================================
   INITIALIZE ADMIN DASHBOARD
========================================================= */

function initializeAdminDashboard() {

    setupNavigation();

    setupMobileMenu();

    setupLogout();

    setupStudentManagement();

    setupAttendanceManagement();

    loadStudents();

    loadAttendance();

    setupResultManagement();

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function setupNavigation() {

    const navLinks =
        document.querySelectorAll(".nav-link");

    const pages =
        document.querySelectorAll(".page");

    const quickActions =
        document.querySelectorAll(
            ".quick-action"
        );


    function openPage(pageId) {

        pages.forEach(function (page) {

            page.classList.remove(
                "active-page"
            );

        });


        navLinks.forEach(function (link) {

            link.classList.remove(
                "active"
            );

        });


        const targetPage =
            document.getElementById(pageId);


        const targetLink =
            document.querySelector(
                `.nav-link[data-page="${pageId}"]`
            );


        if (targetPage) {

            targetPage.classList.add(
                "active-page"
            );

        }


        if (targetLink) {

            targetLink.classList.add(
                "active"
            );

        }


        updatePageHeader(pageId);

    }


    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const pageId =
                    link.dataset.page;

                openPage(pageId);

            }
        );

    });


    quickActions.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const pageId =
                    button.dataset.open;

                openPage(pageId);

            }
        );

    });

}


/* =========================================================
   PAGE HEADER
========================================================= */

function updatePageHeader(pageId) {

    const pageTitle =
        document.getElementById(
            "pageTitle"
        );

    const pageSubtitle =
        document.getElementById(
            "pageSubtitle"
        );


    const pageInformation = {

        dashboard: {
            title: "Admin Dashboard",
            subtitle:
                "Manage your student system"
        },

        students: {
            title: "Student Management",
            subtitle:
                "Add, edit, search and manage student records"
        },

        attendance: {
            title: "Attendance Management",
            subtitle:
                "Monitor and manage student attendance"
        },

        results: {
            title: "Result Management",
            subtitle:
                "Manage examination results"
        },

        courses: {
            title: "Course Management",
            subtitle:
                "Manage academic courses"
        },

        settings: {
            title: "System Settings",
            subtitle:
                "View system configuration"
        }

    };


    const information =
        pageInformation[pageId];


    if (!information) {
        return;
    }


    if (pageTitle) {

        pageTitle.textContent =
            information.title;

    }


    if (pageSubtitle) {

        pageSubtitle.textContent =
            information.subtitle;

    }

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const menuButton =
        document.getElementById(
            "mobileMenuBtn"
        );

    const sidebar =
        document.getElementById(
            "adminSidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (!menuButton || !sidebar) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "show"
            );

            if (overlay) {

                overlay.classList.toggle(
                    "show"
                );

            }

        }
    );


    if (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                sidebar.classList.remove(
                    "show"
                );

                overlay.classList.remove(
                    "show"
                );

            }
        );

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "adminLogout"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
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


            window.location.replace(
                "login.html"
            );

        }
    );

}


/* =========================================================
   STUDENT MANAGEMENT
========================================================= */

function setupStudentManagement() {

    const addStudentButton =
        document.getElementById(
            "addStudentBtn"
        );

    const refreshButton =
        document.getElementById(
            "refreshStudentsBtn"
        );

    const searchInput =
        document.getElementById(
            "studentSearch"
        );


    /* ADD STUDENT BUTTON */

    if (addStudentButton) {

        addStudentButton.addEventListener(
            "click",
            function () {

                openStudentModal();

            }
        );

    }


    /* REFRESH */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                loadStudents();

            }
        );

    }


    /* SEARCH */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                filterStudents(
                    searchInput.value
                );

            }
        );

    }


    setupStudentModal();

}


/* =========================================================
   STUDENT MODAL
========================================================= */

function setupStudentModal() {

    const modal =
        document.getElementById(
            "studentModal"
        );

    const form =
        document.getElementById(
            "studentForm"
        );

    const closeButton =
        document.getElementById(
            "closeStudentModal"
        );

    const cancelButton =
        document.getElementById(
            "cancelStudentBtn"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeStudentModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeStudentModal
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            addStudent
        );

    }


    /* Close when clicking outside */

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeStudentModal();

                }

            }
        );

    }

}


/* =========================================================
   OPEN STUDENT MODAL
========================================================= */

function openStudentModal() {

    const modal =
        document.getElementById(
            "studentModal"
        );

    const form =
        document.getElementById(
            "studentForm"
        );


    if (!modal) {

        console.error(
            "studentModal not found."
        );

        return;

    }


    if (form) {

        form.reset();

    }


    modal.classList.add(
        "show"
    );

    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   CLOSE STUDENT MODAL
========================================================= */

function closeStudentModal() {

    const modal =
        document.getElementById(
            "studentModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   ADD STUDENT
========================================================= */

async function addStudent(event) {

    event.preventDefault();


    const nameInput =
        document.getElementById(
            "studentName"
        );

    const emailInput =
        document.getElementById(
            "studentEmail"
        );

    const mobileInput =
        document.getElementById(
            "studentMobile"
        );

    const courseInput =
        document.getElementById(
            "studentCourse"
        );

    const semesterInput =
        document.getElementById(
            "studentSemester"
        );


    /*
       IMPORTANT:

       Student ID is NOT entered manually.

       Backend automatically creates:

       Student ID
       Username
       Temporary Password
    */


    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const email =
        emailInput
            ? emailInput.value.trim()
            : "";

    const mobile =
        mobileInput
            ? mobileInput.value.trim()
            : "";

    const course =
        courseInput
            ? courseInput.value.trim()
            : "";

    const semester =
        semesterInput
            ? Number(
                semesterInput.value
            )
            : 0;


    /* VALIDATION */

    if (!name) {

        alert(
            "Please enter student name."
        );

        return;

    }


    if (!email) {

        alert(
            "Please enter student email."
        );

        return;

    }


    if (!course) {

        alert(
            "Please enter student course."
        );

        return;

    }


    if (!semester) {

        alert(
            "Please select semester."
        );

        return;

    }


    const saveButton =
        document.getElementById(
            "saveStudentBtn"
        );


    if (saveButton) {

        saveButton.disabled = true;

        saveButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';

    }


    try {

        const studentData = {

            name: name,

            email: email,

            mobile: mobile,

            course: course,

            semester: semester

        };


        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            studentData
                        )

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to add student."
            );

        }


        /*
           SHOW GENERATED CREDENTIALS
        */

        alert(
            "STUDENT ADDED SUCCESSFULLY!\n\n" +

            "Student ID: " +
            result.studentId +

            "\nUsername: " +
            result.username +

            "\nTemporary Password: " +
            result.temporaryPassword +

            "\n\nPlease save these credentials."
        );


        /* Reset form */

        const form =
            document.getElementById(
                "studentForm"
            );


        if (form) {

            form.reset();

        }


        /* Close modal */

        closeStudentModal();


        /* Reload students */

        await loadStudents();

    }
    catch (error) {

        console.error(
            "Add student error:",
            error
        );


        alert(
            error.message ||
            "Unable to add student."
        );

    }
    finally {

        if (saveButton) {

            saveButton.disabled = false;

            saveButton.innerHTML =
                '<i class="fa-solid fa-user-plus"></i> Add Student';

        }

    }

}


/* =========================================================
   LOAD STUDENTS
========================================================= */

let allStudents = [];


async function loadStudents() {

    const table =
        document.getElementById(
            "studentTable"
        );

    const status =
        document.getElementById(
            "studentStatus"
        );


    if (!table) {
        return;
    }


    if (status) {

        status.textContent =
            "Loading students...";

    }


    try {

        const response =
            await fetch(
                API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load students."
            );

        }


        allStudents =
            await response.json();


        renderStudents(
            allStudents
        );


        updateStudentCount(
            allStudents.length
        );


        if (status) {

            status.textContent =
                allStudents.length +
                " student(s) registered.";

        }

    }
    catch (error) {

        console.error(
            "Load students error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load students.
                    Please make sure the server is running.
                </td>
            </tr>
        `;


        if (status) {

            status.textContent =
                "Unable to load students.";

        }

    }

}


/* =========================================================
   RENDER STUDENTS
========================================================= */

function renderStudents(students) {

    const table =
        document.getElementById(
            "studentTable"
        );


    if (!table) {
        return;
    }


    if (
        !students ||
        students.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No students found.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML = "";


    students.forEach(
        function (student) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            student.studentId
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        student.name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        student.email
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        student.course
                    )}
                </td>

                <td>
                    Semester
                    ${escapeHTML(
                        String(
                            student.semester
                        )
                    )}
                </td>

                <td>

                    <div class="table-actions">

                        <button
                            type="button"
                            class="edit-btn"
                            data-id="${student.id}"
                            title="Edit Student"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            data-id="${student.id}"
                            title="Delete Student"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );


    /* Edit buttons */

    table
        .querySelectorAll(
            ".edit-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            button.dataset.id;

                        openEditStudent(
                            id
                        );

                    }
                );

            }
        );


    /* Delete buttons */

    table
        .querySelectorAll(
            ".delete-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            button.dataset.id;

                        deleteStudent(
                    id
                        );

                    }
                );

            }
        );

}


/* =========================================================
   SEARCH STUDENTS
========================================================= */

function filterStudents(searchText) {

    const text =
        searchText
            .toLowerCase()
            .trim();


    if (!text) {

        renderStudents(
            allStudents
        );

        return;

    }


    const filtered =
        allStudents.filter(
            function (student) {

                return (

                    String(
                        student.studentId
                    )
                    .toLowerCase()
                    .includes(text)

                    ||

                    String(
                        student.name
                    )
                    .toLowerCase()
                    .includes(text)

                    ||

                    String(
                        student.email
                    )
                    .toLowerCase()
                    .includes(text)

                    ||

                    String(
                        student.course
                    )
                    .toLowerCase()
                    .includes(text)

                );

            }
        );


    renderStudents(
        filtered
    );

}


/* =========================================================
   UPDATE STUDENT COUNT
========================================================= */

function updateStudentCount(count) {

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    if (totalStudents) {

        totalStudents.textContent =
            count;

    }

}


/* =========================================================
   EDIT STUDENT
========================================================= */

function openEditStudent(id) {

    const student =
        allStudents.find(
            function (item) {

                return String(
                    item.id
                ) === String(id);

            }
        );


    if (!student) {

        alert(
            "Student not found."
        );

        return;

    }


    const modal =
        document.getElementById(
            "editStudentModal"
        );

    const idInput =
        document.getElementById(
            "editStudentId"
        );

    const nameInput =
        document.getElementById(
            "editStudentName"
        );

    const emailInput =
        document.getElementById(
            "editStudentEmail"
        );

    const mobileInput =
        document.getElementById(
            "editStudentMobile"
        );

    const courseInput =
        document.getElementById(
            "editStudentCourse"
        );

    const semesterInput =
        document.getElementById(
            "editStudentSemester"
        );


    if (idInput) {
        idInput.value =
            student.studentId;
    }

    if (nameInput) {
        nameInput.value =
            student.name;
    }

    if (emailInput) {
        emailInput.value =
            student.email;
    }

    if (mobileInput) {
        mobileInput.value =
            student.mobile || "";
    }

    if (courseInput) {
        courseInput.value =
            student.course;
    }

    if (semesterInput) {
        semesterInput.value =
            student.semester;
    }


    if (modal) {

        modal.classList.add(
            "show"
        );

        document.body.classList.add(
            "modal-open"
        );

    }


    setupEditForm();

}


/* =========================================================
   EDIT FORM
========================================================= */

let editFormInitialized = false;


function setupEditForm() {

    if (editFormInitialized) {
        return;
    }


    const form =
        document.getElementById(
            "editStudentForm"
        );


    const closeButton =
        document.getElementById(
            "closeEditStudentModal"
        );


    const cancelButton =
        document.getElementById(
            "cancelEditStudentBtn"
        );


    if (!form) {
        return;
    }


    editFormInitialized = true;


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeEditStudentModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeEditStudentModal
        );

    }


    form.addEventListener(
        "submit",
        updateStudent
    );

}


/* =========================================================
   UPDATE STUDENT
========================================================= */

async function updateStudent(event) {

    event.preventDefault();


    const studentIdInput =
        document.getElementById(
            "editStudentId"
        );

    const nameInput =
        document.getElementById(
            "editStudentName"
        );

    const emailInput =
        document.getElementById(
            "editStudentEmail"
        );

    const mobileInput =
        document.getElementById(
            "editStudentMobile"
        );

    const courseInput =
        document.getElementById(
            "editStudentCourse"
        );

    const semesterInput =
        document.getElementById(
            "editStudentSemester"
        );


    const studentId =
        studentIdInput.value;

    const studentData = {

        name:
            nameInput.value.trim(),

        email:
            emailInput.value.trim(),

        mobile:
            mobileInput.value.trim(),

        course:
            courseInput.value.trim(),

        semester:
            Number(
                semesterInput.value
            )

    };


    if (
        !studentData.name ||
        !studentData.email ||
        !studentData.course ||
        !studentData.semester
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${studentId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            studentData
                        )

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to update student."
            );

        }


        alert(
            "Student updated successfully."
        );


        closeEditStudentModal();


        await loadStudents();

    }
    catch (error) {

        console.error(
            "Update student error:",
            error
        );


        alert(
            error.message ||
            "Unable to update student."
        );

    }

}


/* =========================================================
   CLOSE EDIT MODAL
========================================================= */

function closeEditStudentModal() {

    const modal =
        document.getElementById(
            "editStudentModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   DELETE STUDENT
========================================================= */


/* =========================================================
   DELETE STUDENT — FIXED
========================================================= */

async function deleteStudent(id) {

    // Find the student using the numeric database ID
    const student = allStudents.find(function (item) {
        return String(item.id) === String(id);
    });

    if (!student) {
        alert("Student not found in the current list. Please refresh.");
        await loadStudents();
        return;
    }

    const confirmation = confirm(
        "Are you sure you want to delete " + student.name + "?"
    );

    if (!confirmation) {
        return;
    }

    try {
        // IMPORTANT:
        // server.js expects studentId (e.g. STU001),
        // not the numeric database ID (e.g. 1).
        const response = await fetch(
            `${API_URL}/${encodeURIComponent(student.studentId)}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to delete student."
            );
        }

        alert("Student deleted successfully.");

        // Refresh student and related attendance lists
        await loadStudents();
        await loadAttendance();

    } catch (error) {
        console.error("Delete student error:", error);
        alert(error.message || "Unable to delete student.");
    }
}



/* =========================================================
   ATTENDANCE MANAGEMENT
========================================================= */

function setupAttendanceManagement() {

    const openButton =
        document.getElementById(
            "openAttendanceModalBtn"
        );

    const refreshButton =
        document.getElementById(
            "refreshAttendanceBtn"
        );

    const form =
        document.getElementById(
            "attendanceForm"
        );

    const closeButton =
        document.getElementById(
            "closeAttendanceModal"
        );

    const cancelButton =
        document.getElementById(
            "cancelAttendanceBtn"
        );


    if (openButton) {

        openButton.addEventListener(
            "click",
            openAttendanceModal
        );

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadAttendance
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeAttendanceModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeAttendanceModal
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            markAttendance
        );

    }


    /* Today's date */

    const dateInput =
        document.getElementById(
            "attendanceDate"
        );


    if (
        dateInput &&
        !dateInput.value
    ) {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        dateInput.value =
            `${year}-${month}-${day}`;

    }

}

/* =========================================================
   RESULT MANAGEMENT
   ONLY "ADD RESULT" BUTTON OPENS RESULT FORM
========================================================= */

const RESULTS_API =
    "http://localhost:5000/api/results";


/* =========================================================
   SETUP RESULT MANAGEMENT
========================================================= */

function setupResultManagement() {

    const openButton =
        document.getElementById(
            "openResultModalBtn"
        );

    const refreshButton =
        document.getElementById(
            "refreshResultsBtn"
        );

    const modal =
        document.getElementById(
            "resultModal"
        );

    const closeButton =
        document.getElementById(
            "closeResultModal"
        );

    const cancelButton =
        document.getElementById(
            "cancelResultBtn"
        );

    const form =
        document.getElementById(
            "resultForm"
        );


    /* =========================================
       ONLY ADD RESULT BUTTON OPENS FORM
    ========================================= */

    if (openButton) {

        openButton.addEventListener(
            "click",
            openResultModal
        );

    }


    /* =========================================
       REFRESH RESULTS
    ========================================= */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadResults
        );

    }


    /* =========================================
       CLOSE BUTTON
    ========================================= */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeResultModal
        );

    }


    /* =========================================
       CANCEL BUTTON
    ========================================= */

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeResultModal
        );

    }


    /* =========================================
       CLICK OUTSIDE MODAL
    ========================================= */

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (event.target === modal) {

                    closeResultModal();

                }

            }
        );

    }


    /* =========================================
       ADD RESULT FORM
    ========================================= */

    if (form) {

        form.addEventListener(
            "submit",
            addResult
        );

    }


    /* =========================================
       DELETE RESULT
    ========================================= */

    const table =
        document.getElementById(
            "resultsTableBody"
        );

    if (table) {

        table.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".result-delete-btn"
                    );

                if (!button) {
                    return;
                }

                deleteResult(
                    button.dataset.id
                );

            }
        );

    }

}


/* =========================================================
   OPEN RESULT MODAL
========================================================= */

function openResultModal() {

    const modal =
        document.getElementById(
            "resultModal"
        );

    const form =
        document.getElementById(
            "resultForm"
        );


    if (!modal) {
        return;
    }


    if (form) {

        form.reset();

    }


    modal.classList.add(
        "show"
    );

    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   CLOSE RESULT MODAL
========================================================= */

function closeResultModal() {

    const modal =
        document.getElementById(
            "resultModal"
        );

    const form =
        document.getElementById(
            "resultForm"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    if (form) {

        form.reset();

    }


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   ADD RESULT
========================================================= */

async function addResult(event) {

    event.preventDefault();


    const studentInput =
        document.getElementById(
            "resultStudent"
        );

    const subjectInput =
        document.getElementById(
            "resultSubject"
        );

    const marksInput =
        document.getElementById(
            "resultMarks"
        );

    const saveButton =
        document.getElementById(
            "saveResultBtn"
        );


    const studentId =
        studentInput
            ? studentInput.value.trim()
            : "";


    const subject =
        subjectInput
            ? subjectInput.value.trim()
            : "";


    const marksText =
        marksInput
            ? marksInput.value.trim()
            : "";


    /* =========================================
       VALIDATION
    ========================================= */

    if (!studentId) {

        alert(
            "Please enter Student ID."
        );

        return;

    }


    if (!subject) {

        alert(
            "Please enter Subject."
        );

        return;

    }


    if (marksText === "") {

        alert(
            "Please enter Marks."
        );

        return;

    }


    const marks =
        Number(marksText);


    if (
        Number.isNaN(marks) ||
        marks < 0 ||
        marks > 100
    ) {

        alert(
            "Marks must be between 0 and 100."
        );

        return;

    }


    /* =========================================
       DISABLE BUTTON
    ========================================= */

    if (saveButton) {

        saveButton.disabled = true;

        saveButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    }


    try {

        const response =
            await fetch(
                RESULTS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            studentId:
                                studentId,

                            subject:
                                subject,

                            marks:
                                marks

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to add result."
            );

        }


        alert(
            "Result added successfully!"
        );


        closeResultModal();


        await loadResults();

    }
    catch (error) {

        console.error(
            "Add result error:",
            error
        );


        alert(
            error.message ||
            "Unable to add result."
        );

    }
    finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.innerHTML =
                '<i class="fa-solid fa-square-poll-vertical"></i> Add Result';

        }

    }

}


/* =========================================================
   LOAD RESULTS
========================================================= */

async function loadResults() {

    const table =
        document.getElementById(
            "resultsTableBody"
        );


    if (!table) {
        return;
    }


    table.innerHTML = `
        <tr>
            <td
                colspan="8"
                class="table-loading"
            >
                Loading results...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                RESULTS_API
            );


        const results =
            await response.json();


        if (!response.ok) {

            throw new Error(
                results.message ||
                "Unable to load results."
            );

        }


        renderResults(
            results
        );

    }
    catch (error) {

        console.error(
            "Load results error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="8">
                    Unable to load results.
                    Please make sure the server is running.
                </td>
            </tr>
        `;

    }

}


/* =========================================================
   RENDER RESULTS
========================================================= */

function renderResults(results) {

    const table =
        document.getElementById(
            "resultsTableBody"
        );


    if (!table) {
        return;
    }


    /* =========================================
       SUMMARY
    ========================================= */

    const total =
        results.length;


    const passed =
        results.filter(
            function (result) {

                return Number(
                    result.marks
                ) >= 40;

            }
        ).length;


    const failed =
        results.filter(
            function (result) {

                return Number(
                    result.marks
                ) < 40;

            }
        ).length;


    const average =
        total > 0
            ? results.reduce(
                function (sum, result) {

                    return (
                        sum +
                        Number(result.marks)
                    );

                },
                0
            ) / total
            : 0;


    /* =========================================
       UPDATE SUMMARY
    ========================================= */

    const totalElement =
        document.getElementById(
            "totalResults"
        );

    const passedElement =
        document.getElementById(
            "passedResults"
        );

    const failedElement =
        document.getElementById(
            "failedResults"
        );

    const averageElement =
        document.getElementById(
            "averageMarks"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (passedElement) {

        passedElement.textContent =
            passed;

    }


    if (failedElement) {

        failedElement.textContent =
            failed;

    }


    if (averageElement) {

        averageElement.textContent =
            average.toFixed(1) + "%";

    }


    /* =========================================
       NO RESULTS
    ========================================= */

    if (
        !results ||
        results.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="8">
                    No results available.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML = "";


    /* =========================================
       CREATE TABLE ROWS
    ========================================= */

    results.forEach(
        function (result) {

            const marks =
                Number(
                    result.marks
                );


            const passed =
                marks >= 40;


            const badge =
                passed

                    ? `
                        <span class="result-pass">
                            <i class="fa-solid fa-check"></i>
                            Pass
                        </span>
                    `

                    : `
                        <span class="result-fail">
                            <i class="fa-solid fa-xmark"></i>
                            Fail
                        </span>
                    `;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(result.id)}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(result.studentId)}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        result.studentName ||
                        "Unknown Student"
                    )}
                </td>

                <td>
                    ${escapeHTML(result.subject)}
                </td>

                <td>
                    <span class="result-marks">
                        ${marks}/100
                    </span>
                </td>

                <td>
                    <span class="result-grade">
                        ${escapeHTML(result.grade)}
                    </span>
                </td>

                <td>
                    ${badge}
                </td>

                <td>

                    <button
                        type="button"
                        class="delete-btn result-delete-btn"
                        data-id="${escapeHTML(result.id)}"
                        title="Delete Result"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   DELETE RESULT
========================================================= */

async function deleteResult(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this result?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const response =
            await fetch(
                `${RESULTS_API}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete result."
            );

        }


        alert(
            "Result deleted successfully."
        );


        await loadResults();

    }
    catch (error) {

        console.error(
            "Delete result error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete result."
        );

    }

}

/* =========================================================
   OPEN ATTENDANCE MODAL
========================================================= */

function openAttendanceModal() {

    const modal =
        document.getElementById(
            "attendanceModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

        document.body.classList.add(
            "modal-open"
        );

    }

}


/* =========================================================
   CLOSE ATTENDANCE MODAL
========================================================= */

function closeAttendanceModal() {

    const modal =
        document.getElementById(
            "attendanceModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   MARK ATTENDANCE — FIXED
========================================================= */

async function markAttendance(event) {
    event.preventDefault();

    const form = event.currentTarget?.tagName === "FORM"
        ? event.currentTarget
        : document.getElementById("attendanceForm");

    if (!form) {
        alert("Attendance form not found. Please check attendanceForm ID.");
        return;
    }

    // Read the values from the actual attendance form
    const studentIdInput =
        form.querySelector('[name="studentId"]') ||
        form.querySelector("#studentId");

    const dateInput =
        form.querySelector('[name="date"]') ||
        form.querySelector("#attendanceDate");

    const statusInput =
        form.querySelector('[name="status"]') ||
        form.querySelector("#attendanceStatus");

    const studentId = studentIdInput?.value.trim() || "";
    const date = dateInput?.value || "";
    const status = statusInput?.value || "";

    // Debugging: check the actual values being read
    console.log("Student ID entered:", studentId);
    console.log("Attendance date:", date);
    console.log("Attendance status:", status);

    if (!studentId) {
        alert("Please enter the Student ID.");
        studentIdInput?.focus();
        return;
    }

    if (!date) {
        alert("Please select the attendance date.");
        dateInput?.focus();
        return;
    }

    if (!["Present", "Absent"].includes(status)) {
        alert("Please select Present or Absent.");
        statusInput?.focus();
        return;
    }

    const saveButton = form.querySelector(
        'button[type="submit"], #saveAttendanceBtn'
    );

    try {
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.textContent = "Saving...";
        }

        const response = await fetch(
            "http://localhost:5000/api/attendance",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId,
                    date,
                    status
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to mark attendance."
            );
        }

        alert("Attendance marked successfully!");

        form.reset();

        const today = new Date();
        const localDate = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        if (dateInput) {
            dateInput.value = localDate;
        }

        if (typeof closeAttendanceModal === "function") {
            closeAttendanceModal();
        }

        if (typeof loadAttendance === "function") {
            await loadAttendance();
        }
    } catch (error) {
        console.error("Attendance error:", error);
        alert(error.message || "Unable to mark attendance.");
    } finally {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = "Mark Attendance";
        }
    }
}

/* =========================================================
   LOAD ATTENDANCE
========================================================= */

async function loadAttendance() {

    const table =
        document.getElementById(
            "attendanceTableBody"
        );


    if (!table) {
        return;
    }


    try {

        const response =
            await fetch(
                ATTENDANCE_API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load attendance."
            );

        }


        const attendance =
            await response.json();


        renderAttendance(
            attendance
        );

    }
    catch (error) {

        console.error(
            "Load attendance error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load attendance.
                </td>
            </tr>
        `;

    }

}


/* =========================================================
   RENDER ATTENDANCE
========================================================= */

function renderAttendance(attendance) {

    const table =
        document.getElementById(
            "attendanceTableBody"
        );


    if (!table) {
        return;
    }


    const total =
        attendance.length;


    const present =
        attendance.filter(
            function (record) {

                return record.status ===
                    "Present";

            }
        ).length;


    const absent =
        attendance.filter(
            function (record) {

                return record.status ===
                    "Absent";

            }
        ).length;


    const totalElement =
        document.getElementById(
            "totalAttendance"
        );

    const presentElement =
        document.getElementById(
            "presentCount"
        );

    const absentElement =
        document.getElementById(
            "absentCount"
        );


    if (totalElement) {
        totalElement.textContent =
            total;
    }

    if (presentElement) {
        presentElement.textContent =
            present;
    }

    if (absentElement) {
        absentElement.textContent =
            absent;
    }


    if (
        !attendance ||
        attendance.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No attendance records found.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML = "";


    attendance.forEach(
        function (record) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        String(
                            record.id
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.studentId
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.studentName ||
                        "Unknown"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.date
                    )}
                </td>

                <td>

                    <span class="badge ${
                        record.status ===
                        "Present"
                            ? "success"
                            : "warning"
                    }">

                        ${escapeHTML(
                            record.status
                        )}

                    </span>

                </td>

                <td>

                    <button
                        type="button"
                        class="delete-btn attendance-delete-btn"
                        data-id="${record.id}"
                        title="Delete Attendance"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );


    table
        .querySelectorAll(
            ".attendance-delete-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        deleteAttendance(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


/* =========================================================
   DELETE ATTENDANCE
========================================================= */

async function deleteAttendance(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this attendance record?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const response =
            await fetch(
                `${ATTENDANCE_API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to delete attendance."
            );

        }


        alert(
            "Attendance record deleted."
        );


        await loadAttendance();

    }
    catch (error) {

        console.error(
            "Delete attendance error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete attendance."
        );

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   KEYBOARD ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        closeStudentModal();

        closeEditStudentModal();

        closeAttendanceModal();

    }
);
