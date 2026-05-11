const express = require("express");
const router = express.Router();

const db = require("../database/db");

router.post("/", (req, res) => {
  const {
    event_id,
    firstname,
    lastname,
    email,
    phone
  } = req.body;

  if (!event_id || !firstname || !lastname || !email) {
    return res.status(400).json({
      error: "Champs obligatoires manquants"
    });
  }

  const sql = `
    INSERT INTO event_registrations (
      event_id,
      firstname,
      lastname,
      email,
      phone
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [event_id, firstname, lastname, email, phone],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        message: "Inscription créée avec succès",
        registration: {
          id: this.lastID,
          event_id,
          firstname,
          lastname,
          email,
          phone
        }
      });
    }
  );
});



router.get("/:eventId", (req, res) => {
  const { eventId } = req.params;

  const sql = `
    SELECT *
    FROM event_registrations
    WHERE event_id = ?
    ORDER BY created_at DESC
  `;

  db.all(sql, [eventId], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(rows);
  });
});






router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM event_registrations ORDER BY created_at DESC",
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



router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, phone } = req.body;

  if (!firstname || !lastname || !email) {
    return res.status(400).json({
      error: "Prénom, nom et email obligatoires"
    });
  }

  const sql = `
    UPDATE event_registrations
    SET firstname = ?, lastname = ?, email = ?, phone = ?
    WHERE id = ?
  `;

  db.run(sql, [firstname, lastname, email, phone, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Inscription introuvable" });
    }

    res.json({
      message: "Inscription modifiée avec succès"
    });
  });
});





router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM event_registrations WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Inscription introuvable" });
      }

      res.json({
        message: "Inscription supprimée avec succès"
      });
    }
  );
});





module.exports = router;