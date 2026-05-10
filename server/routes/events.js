const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/", (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(rows);
  });
});


router.post("/", (req, res) => {
  const { title, description, event_date, location, image } = req.body;

  if (!title || !event_date || !location) {
    return res.status(400).json({
      error: "Le titre, la date et le lieu sont obligatoires"
    });
  }

  const sql = `
    INSERT INTO events (title, description, event_date, location, image)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [title, description, event_date, location, image], function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.status(201).json({
      message: "Événement créé avec succès",
      event: {
        id: this.lastID,
        title,
        description,
        event_date,
        location,
        image
      }
    });
  });
});





router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, event_date, location, image } = req.body;

  if (!title || !event_date || !location) {
    return res.status(400).json({
      error: "Le titre, la date et le lieu sont obligatoires"
    });
  }

  const sql = `
    UPDATE events
    SET title = ?, description = ?, event_date = ?, location = ?, image = ?
    WHERE id = ?
  `;

  db.run(sql, [title, description, event_date, location, image, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Événement introuvable" });
    }

    res.json({
      message: "Événement modifié avec succès",
      event: {
        id,
        title,
        description,
        event_date,
        location,
        image
      }
    });
  });
});








router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM events WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Événement introuvable" });
    }

    res.json({
      message: "Événement supprimé avec succès",
      id
    });
  });
});




module.exports = router;