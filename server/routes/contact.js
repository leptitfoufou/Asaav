const express = require("express");
const router = express.Router();

const db = require("../database/db");

router.post("/", (req, res) => {

  const {
    name,
    email,
    subject,
    message
  } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      error: "Champs obligatoires manquants"
    });
  }

  const sql = `
    INSERT INTO contact_messages (
      name,
      email,
      subject,
      message
    )
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name, email, subject, message],
    function (err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        message: "Message envoyé avec succès",
        id: this.lastID
      });

    }
  );

});





router.get("/", (req, res) => {

  db.all(
    `
    SELECT *
    FROM contact_messages
    ORDER BY created_at DESC
    `,
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





router.delete("/:id", (req, res) => {

  const { id } = req.params;

  db.run(
    `
    DELETE FROM contact_messages
    WHERE id = ?
    `,
    [id],
    function (err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Message introuvable"
        });
      }

      res.json({
        message: "Message supprimé"
      });

    }
  );

});

module.exports = router;