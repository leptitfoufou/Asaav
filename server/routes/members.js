const express = require("express");
const router = express.Router();

const db = require("../database/db");

router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM members ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});

router.post("/", (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    member_type
  } = req.body;

  if (!firstname || !lastname || !email || !member_type) {
    return res.status(400).json({
      error: "Champs obligatoires manquants"
    });
  }

  const sql = `
    INSERT INTO members (
      firstname,
      lastname,
      email,
      phone,
      member_type
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [firstname, lastname, email, phone, member_type],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        message: "Membre créé avec succès",
        member: {
          id: this.lastID,
          firstname,
          lastname,
          email,
          phone,
          member_type
        }
      });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  const {
    firstname,
    lastname,
    email,
    phone,
    member_type
  } = req.body;

  const sql = `
    UPDATE members
    SET
      firstname = ?,
      lastname = ?,
      email = ?,
      phone = ?,
      member_type = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [firstname, lastname, email, phone, member_type, id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        message: "Membre modifié avec succès"
      });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM members WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        message: "Membre supprimé avec succès"
      });
    }
  );
});

module.exports = router;