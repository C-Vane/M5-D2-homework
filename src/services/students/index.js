const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const router = express.Router();

//students file
const buffer = fs.readFileSync(path.join(__dirname, "students.json"));
const studentsArray = JSON.parse(buffer.toString());
const checkBody = (body) => {
  if (body.Name.length > 2 && body.Surname.length > 2 && body.Email.length > 4 && body.DateofBirth.length > 4) return true;
  else return false;
};
//get all students
router.get("/", (req, res) => {
  res.send(studentsArray);
});
// get student with unique id
router.get("/:id", (req, res) => {
  const student = studentsArray.filter((student) => student.id === req.params.id);
  res.send(student);
});
// post student
router.post("/", (req, res) => {
  const newStudent = req.body;
  if (checkBody(newStudent)) {
    const checkEmail = studentsArray.some((student) => student.Email === newStudent.Email);
    if (checkEmail) {
      res.status(400).send("Student Email already used/Exists");
    } else {
      newStudent.id = uniqid();
      studentsArray.push(newStudent);
      fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(studentsArray));
      res.send(newStudent.id);
    }
  } else res.status(400).send("Body missing data");
});
//post check email
router.post("/checkEmail", (req, res) => {
  const email = req.body.Email;
  console.log(email);
  const checkEmail = studentsArray.some((student) => student.Email === email);
  if (checkEmail) res.send(true);
  else res.send(false);
});
// put/ edit student
router.put("/:id", (req, res) => {
  const editStudent = req.body;
  editStudent.id = req.params.id;
  if (checkBody(editStudent)) {
    let edited;
    studentsArray.forEach((student, index) => {
      if (student.id === req.params.id) {
        edited = index;
      } else false;
    });
    !edited && res.status(400).send("Incorrect id");
    studentsArray[edited] = editStudent;
    fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(studentsArray));
    res.send("edited");
  } else res.status(400).send("Body missing data");
});
// delete student
router.delete("/:id", (req, res) => {
  let deleteStudent;
  studentsArray.forEach((student, index) => {
    if (student.id === req.params.id) {
      deleteStudent = index;
      console.log(index);
    }
  });
  if (deleteStudent === undefined) res.status(400).send("Incorrect id");
  else {
    studentsArray.splice(deleteStudent, 1);
    fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(studentsArray));
    res.send("Deleted");
  }
});
module.exports = router;
