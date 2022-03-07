const pool = require("../../db");
const queries = require("./queries");

const getStudents = (_req, res) => {
  pool.query(queries.getStudents, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getStudentsById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getStudentsById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addStudent = (req, res) => {
  const { name, email, age, dob } = req.body;
  pool.query(queries.checkEmailExists, [email], (_error, results) => {
    if (results.rows.length) return res.send("email already exists.");

    pool.query(
      queries.addStudent,
      [name, email, age, dob],
      (error, _results) => {
        if (error) throw error;

        res.status(201).send("student has been created successfully");
      }
    );
  });
};

const removeStudent = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getStudentsById, [id], (_error, results) => {
    const noStudentFound = !results.rows.length;

    if (noStudentFound) return res.send("student doesn't exists.");

    pool.query(queries.removeStudent, [id], (error, _results) => {
      if (error) throw error;

      res.status(200).send("student was deleted successfully.");
    });
  });
};

const updateStudent = (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  pool.query(queries.getStudentsById, [id], (_error, results) => {
    const noStudentFound = !results.rows.length;

    if (noStudentFound) return res.send("student doesn't exists.");

    pool.query(queries.updateStudent, [name, id], (error, _results) => {
      if (error) throw error;

      res.status(200).send("student was updated successfully.");
    });
  });
};

module.exports = {
  getStudents,
  getStudentsById,
  addStudent,
  removeStudent,
  updateStudent,
};
