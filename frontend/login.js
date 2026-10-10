"use strict";


/* ======================================
   LOGIN ELEMENTS
====================================== */

const adminBtn =
    document.getElementById("adminBtn");

const studentBtn =
    document.getElementById("studentBtn");

const adminField =
    document.getElementById("adminField");

const studentField =
    document.getElementById("studentField");

const adminUsername =
    document.getElementById("adminUsername");

const studentId =
    document.getElementById("studentId");

const password =
    document.getElementById("password");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const demoText =
    document.getElementById("demoText");


let selectedRole = "admin";


/* ======================================
   ADMIN ROLE
====================================== */

adminBtn.addEventListener("click", function () {

    selectedRole = "admin";

    adminBtn.classList.add("active");

    studentBtn.classList.remove("active");

    adminField.classList.remove("hidden");

    studentField.classList.add("hidden");

    adminUsername.required = true;

    studentId.required = false;

    demoText.textContent =
        "Admin: admin / admin123";

    clearMessage();

});


/* ======================================
   STUDENT ROLE
====================================== */

studentBtn.addEventListener("click", function () {

    selectedRole = "student";

    studentBtn.classList.add("active");

    adminBtn.classList.remove("active");

    studentField.classList.remove("hidden");

    adminField.classList.add("hidden");

    studentId.required = true;

    adminUsername.required = false;

    demoText.textContent =
        "Use your Student ID and password";

    clearMessage();

});


/* ======================================
   LOGIN
====================================== */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const enteredPassword =
            password.value.trim();


        /* =================================
           ADMIN LOGIN
        ================================= */

        if (selectedRole === "admin") {

            const username =
                adminUsername.value.trim();


            if (
                username === "admin" &&
                enteredPassword === "admin123"
            ) {

                localStorage.setItem(
                    "userRole",
                    "admin"
                );

                localStorage.removeItem(
                    "studentId"
                );

                localStorage.removeItem(
                    "studentData"
                );


                showSuccess(
                    "Admin login successful. Opening Admin Dashboard..."
                );


                setTimeout(function () {

                    window.location.href =
                        "index.html";

                }, 700);

            }

            else {

                showError(
                    "Invalid Admin username or password."
                );

            }


            return;

        }


        /* =================================
           STUDENT LOGIN
        ================================= */

        const id =
            studentId.value.trim();


        if (!id) {

            showError(
                "Please enter your Student ID."
            );

            return;

        }


        if (!enteredPassword) {

            showError(
                "Please enter your password."
            );

            return;

        }


        /* =================================
           DISABLE LOGIN BUTTON
        ================================= */

        const loginButton =
            loginForm.querySelector(
                'button[type="submit"]'
            );


        if (loginButton) {

            loginButton.disabled = true;

            loginButton.textContent =
                "Logging in...";

        }


        try {

            /* =================================
               SEND LOGIN REQUEST TO BACKEND
            ================================= */

            const response =
                await fetch(
                    "http://localhost:5000/api/student/login",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            username: id,

                            password:
                                enteredPassword

                        })

                    }
                );


            const result =
                await response.json();


            /* =================================
               LOGIN FAILED
            ================================= */

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Invalid Student ID or password."
                );

            }


            /* =================================
               LOGIN SUCCESS
            ================================= */

            const student =
                result.student;


            /* Store login information */

            localStorage.setItem(
                "userRole",
                "student"
            );


            localStorage.setItem(
                "studentId",
                student.studentId
            );


            localStorage.setItem(
                "studentData",
                JSON.stringify(student)
            );


            /* Show success */

            showSuccess(
                "Student login successful. Opening Student Portal..."
            );


            /* Open student dashboard */

            setTimeout(function () {

                window.location.href =
                    "student.html";

            }, 700);

        }


        catch (error) {

            console.error(
                "Student Login Error:",
                error
            );


            showError(
                error.message ||
                "Unable to login."
            );

        }


        finally {

            if (loginButton) {

                loginButton.disabled = false;

                loginButton.textContent =
                    "Login";

            }

        }

    }
);


/* ======================================
   MESSAGE FUNCTIONS
====================================== */

function showSuccess(message) {

    loginMessage.textContent =
        message;

    loginMessage.className =
        "login-message success";

}


function showError(message) {

    loginMessage.textContent =
        message;

    loginMessage.className =
        "login-message error";

}


function clearMessage() {

    loginMessage.textContent =
        "";

    loginMessage.className =
        "login-message";

}