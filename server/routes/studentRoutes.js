const express = require("express");
const Student = require("../models/Student");

const router = express.Router();


// GET ALL STUDENTS
router.get("/", async (req, res) => {

    try {

        const students = await Student.find();

        res.json(students);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// GET ONE STUDENT
router.get("/:id", async (req, res) => {

    try {

        const student = await Student.findOne({
            studentId: req.params.id
        });

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.json(student);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ADD NEW STUDENT
router.post("/", async (req, res) => {

    try {

        const student = new Student(req.body);

        const savedStudent = await student.save();

        res.status(201).json(savedStudent);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


// DELETE STUDENT
router.delete("/:id", async (req, res) => {

    try {

        const student = await Student.findOneAndDelete({
            studentId: req.params.id
        });

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


module.exports = router;