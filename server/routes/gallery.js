const express = require("express");
const router = express.Router();

const db = require("../database/db");

router.post("/", (req, res) => {
  const { event_id, image } = req.body;

  if (!event_id || !image) {
    return res.status(400).json({
      error: "event_id et image sont obligatoires"
    });
  }

  db.run(
    `
    INSERT INTO gallery_photos (event_id, image)
    VALUES (?, ?)
    `,
    [event_id, image],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Photo ajoutée",
        photo: {
          id: this.lastID,
          event_id,
          image
        }
      });
    }
  );
});

router.get("/", (req, res) => {
  db.all(
    `
    SELECT gallery_photos.*, events.title, events.event_date
    FROM gallery_photos
    JOIN events ON gallery_photos.event_id = events.id
    ORDER BY events.event_date DESC
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

router.get("/:eventId", (req, res) => {
  const { eventId } = req.params;

  db.all(
    "SELECT * FROM gallery_photos WHERE event_id = ? ORDER BY created_at DESC",
    [eventId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM gallery_photos WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Photo supprimée"
    });
  });
});

module.exports = router;